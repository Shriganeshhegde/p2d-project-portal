const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabase } = require('../utils/supabase');
const Razorpay = require('razorpay');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Initialize Razorpay
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn('⚠️  Razorpay credentials not configured. Payment will run in test mode.');
}

// Create payment order
router.post('/create-order', auth, async (req, res) => {
    try {
        const { amount, projectId, projectData } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!razorpay) {
            return res.status(503).json({ 
                error: 'Payment gateway not configured. Please contact administrator.' 
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            receipt: `receipt_${projectId}_${Date.now()}`,
            notes: {
                projectId: projectId,
                userId: userId,
                projectTitle: projectData.title
            }
        };

        const order = await razorpay.orders.create(options);

        // Store pending payment (files NOT saved yet)
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert([{
                project_id: projectId,
                student_id: userId,
                amount: amount,
                currency: 'INR',
                status: 'pending',
                razorpay_order_id: order.id
            }])
            .select()
            .single();

        if (paymentError) throw paymentError;

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Failed to create payment order',
            details: error.message
        });
    }
});

// Verify payment and save files
router.post('/verify-payment', auth, async (req, res) => {
    try {
        let { projectId, razorpay_order_id, razorpay_payment_id, razorpay_signature, projectData } = req.body;
        const userId = req.user?.id;

        // Generate projectId if not provided
        if (!projectId) {
            projectId = uuidv4();
        }

        console.log('Payment verification started:', {
            projectId,
            userId,
            orderId: razorpay_order_id,
            hasProjectData: !!projectData
        });

        if (!userId) {
            console.error('No userId found in request');
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Verify Razorpay signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            console.error('Invalid payment signature');
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Get payment record
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .eq('student_id', userId)
            .single();

        if (paymentError || !payment) {
            return res.status(404).json({ error: 'Payment record not found' });
        }

        // Payment verified! Now save the project
        // Note: Using actual database schema columns
        const projectInsertData = {
            id: projectId,
            student_id: userId,
            title: projectData.title,
            description: `${projectData.pages} pages, ${projectData.copies} copies, ${projectData.printType} print, ${projectData.bindingType} binding${projectData.bindingColor ? ' (' + projectData.bindingColor + ')' : ''}`,
            department: projectData.department || 'General',
            semester: parseInt(projectData.semester) || 1,
            payment_status: 'paid',
            status: 'pending',
            submission_date: new Date().toISOString()
        };

        console.log('Attempting to insert project:', projectInsertData);

        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert([projectInsertData])
            .select()
            .single();

        if (projectError) {
            console.error('Error saving project:', projectError);
            console.error('Project data attempted:', {
                id: projectId,
                student_id: userId,
                title: projectData.title,
                department: projectData.department,
                semester: projectData.semester
            });
            
            // Return more helpful error
            if (projectError.code === '23503') {
                return res.status(400).json({ 
                    error: 'Invalid user ID. Please login again.',
                    details: 'User account not found in database'
                });
            }
            
            throw projectError;
        }

        // Update payment status to completed
        await supabase
            .from('payments')
            .update({
                status: 'completed',
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature
            })
            .eq('id', payment.id);

        res.json({
            success: true,
            message: 'Payment verified and project saved successfully',
            projectId: project.id
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details
        });
        res.status(500).json({ 
            error: 'Failed to verify payment',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Cleanup expired pending payments (called by cron or manually)
router.post('/cleanup-expired', async (req, res) => {
    try {
        const { adminKey } = req.body;
        
        // Simple admin key check
        if (adminKey !== process.env.ADMIN_KEY) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Find payments pending for more than 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        const { data: expiredPayments, error } = await supabase
            .from('payments')
            .select('*')
            .eq('status', 'pending')
            .lt('created_at', thirtyMinutesAgo.toISOString());

        if (error) throw error;

        let deletedCount = 0;
        for (const payment of expiredPayments || []) {
            // Delete the payment record
            await supabase
                .from('payments')
                .delete()
                .eq('id', payment.id);
            
            deletedCount++;
        }

        res.json({
            success: true,
            message: `Cleaned up ${deletedCount} expired pending payments`,
            deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up expired payments:', error);
        res.status(500).json({ error: 'Cleanup failed' });
    }
});

// Get user payments
router.get('/my-payments', auth, async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: payments, error } = await supabase
            .from('payments')
            .select(`
                *,
                projects (
                    id,
                    title,
                    status
                )
            `)
            .eq('student_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ 
            error: 'Failed to fetch payments',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
