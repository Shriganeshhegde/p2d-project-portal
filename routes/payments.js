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
        let { projectId, razorpay_order_id, razorpay_payment_id, razorpay_signature, projectData, files } = req.body;
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

        // Check if project already exists (to prevent duplicates)
        const { data: existingProject } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        let project;

        if (existingProject) {
            // Update existing project with payment confirmation
            console.log('Updating existing project:', projectId);
            const { data: updatedProject, error: updateError } = await supabase
                .from('projects')
                .update({
                    payment_status: 'paid',
                    status: 'Order Accepted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .select()
                .single();

            if (updateError) throw updateError;
            project = updatedProject;
        } else {
            // Create new project (payment verified)
            console.log('Creating new project:', projectId);
            const projectInsertData = {
                id: projectId,
                student_id: userId,
                title: projectData.title,
                description: `${projectData.pages} pages, ${projectData.copies} copies, ${projectData.printType} print, ${projectData.bindingType} binding${projectData.bindingColor ? ' (' + projectData.bindingColor + ')' : ''}`,
                department: projectData.department || 'General',
                semester: parseInt(projectData.semester) || 1,
                payment_status: 'paid',
                status: 'Order Accepted',
                submission_date: new Date().toISOString()
            };

            const { data: newProject, error: projectError } = await supabase
                .from('projects')
                .insert([projectInsertData])
                .select()
                .single();

            if (projectError) {
                console.error('Error saving project:', projectError);
                
                // Return more helpful error
                if (projectError.code === '23503') {
                    return res.status(400).json({ 
                        error: 'Invalid user ID. Please login again.',
                        details: 'User account not found in database'
                    });
                }
                
                throw projectError;
            }

            project = newProject;
        }

        console.log('Project saved/updated successfully:', project.id);

        // Store file URLs if files were provided
        let fileUrls = [];
        if (files && files.length > 0) {
            console.log(`Storing ${files.length} file(s) for project ${project.id}`);
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    // Convert base64 to buffer if needed
                    const fileData = file.data.includes('base64,') 
                        ? Buffer.from(file.data.split('base64,')[1], 'base64')
                        : file.data;
                    
                    const fileName = `${project.id}/${Date.now()}_${file.name}`;
                    
                    // Upload to Supabase Storage
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('project-documents')
                        .upload(fileName, fileData, {
                            contentType: file.type || 'application/pdf',
                            upsert: false
                        });
                    
                    if (uploadError) {
                        console.error('File upload error:', uploadError);
                        continue;
                    }
                    
                    // Get public URL
                    const { data: urlData } = supabase.storage
                        .from('project-documents')
                        .getPublicUrl(fileName);
                    
                    fileUrls.push({
                        name: file.name,
                        url: urlData.publicUrl,
                        path: fileName,
                        size: file.size
                    });
                    
                    console.log(`✅ File uploaded: ${file.name}`);
                } catch (fileError) {
                    console.error(`Error uploading file ${file.name}:`, fileError);
                }
            }
            
            // Update project with file URLs
            if (fileUrls.length > 0) {
                await supabase
                    .from('projects')
                    .update({
                        file_urls: fileUrls,
                        file_count: fileUrls.length
                    })
                    .eq('id', project.id);
                
                console.log(`✅ Stored ${fileUrls.length} file URL(s) in database`);
            }
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
            projectId: project.id,
            filesUploaded: fileUrls.length
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

// Razorpay Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
        if (!webhookSecret) {
            console.error('⚠️ RAZORPAY_WEBHOOK_SECRET not configured');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        // Get signature from headers
        const signature = req.headers['x-razorpay-signature'];
        
        if (!signature) {
            console.error('❌ No signature in webhook request');
            return res.status(400).json({ error: 'No signature provided' });
        }

        // Verify webhook signature
        const body = req.body.toString();
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Invalid webhook signature');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Parse the webhook payload
        const payload = JSON.parse(body);
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;

        console.log(`✅ Webhook received: ${event}`);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        // Handle different webhook events
        switch (event) {
            case 'payment.authorized':
            case 'payment.captured':
                await handlePaymentSuccess(paymentEntity);
                break;

            case 'payment.failed':
                await handlePaymentFailure(paymentEntity);
                break;

            case 'order.paid':
                await handleOrderPaid(orderEntity);
                break;

            default:
                console.log(`ℹ️ Unhandled webhook event: ${event}`);
        }

        // Always return 200 to acknowledge receipt
        res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        // Still return 200 to prevent retries for invalid requests
        res.status(200).json({ status: 'error', message: error.message });
    }
});

// Helper function to handle successful payment
async function handlePaymentSuccess(payment) {
    try {
        if (!payment) return;

        const orderId = payment.order_id;
        const paymentId = payment.id;
        const amount = payment.amount / 100; // Convert from paise to rupees

        console.log(`💰 Processing successful payment: ${paymentId} for order: ${orderId}`);

        // Update payment record
        const { data: paymentRecord, error: findError } = await supabase
            .from('payments')
            .select('*')
            .eq('razorpay_order_id', orderId)
            .single();

        if (findError || !paymentRecord) {
            console.error('Payment record not found for order:', orderId);
            return;
        }

        // Update payment status
        const { error: updateError } = await supabase
            .from('payments')
            .update({
                status: 'completed',
                razorpay_payment_id: paymentId,
                updated_at: new Date().toISOString()
            })
            .eq('id', paymentRecord.id);

        if (updateError) {
            console.error('Error updating payment:', updateError);
            return;
        }

        // Update project status if exists
        if (paymentRecord.project_id) {
            await supabase
                .from('projects')
                .update({
                    payment_status: 'paid',
                    status: 'Order Accepted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', paymentRecord.project_id);
        }

        console.log(`✅ Payment processed successfully: ${paymentId}`);

    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

// Helper function to handle failed payment
async function handlePaymentFailure(payment) {
    try {
        if (!payment) return;

        const orderId = payment.order_id;
        const paymentId = payment.id;

        console.log(`❌ Processing failed payment: ${paymentId} for order: ${orderId}`);

        // Update payment record
        const { error } = await supabase
            .from('payments')
            .update({
                status: 'failed',
                razorpay_payment_id: paymentId,
                updated_at: new Date().toISOString()
            })
            .eq('razorpay_order_id', orderId);

        if (error) {
            console.error('Error updating failed payment:', error);
        }

        console.log(`✅ Failed payment recorded: ${paymentId}`);

    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

// Helper function to handle order paid event
async function handleOrderPaid(order) {
    try {
        if (!order) return;

        const orderId = order.id;
        const amount = order.amount / 100;

        console.log(`📦 Order paid: ${orderId}, Amount: ₹${amount}`);

        // Update payment record
        await supabase
            .from('payments')
            .update({
                status: 'completed',
                updated_at: new Date().toISOString()
            })
            .eq('razorpay_order_id', orderId);

        console.log(`✅ Order payment processed: ${orderId}`);

    } catch (error) {
        console.error('Error handling order paid:', error);
    }
}

module.exports = router;
