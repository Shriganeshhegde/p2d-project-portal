const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const archiver = require('archiver');
const { 
  getAllStudentFolders, 
  getStudentFolderContents 
} = require('../utils/fileOrganizer');
const { supabase } = require('../utils/supabase');

// Vendor authentication middleware (simple password for now)
const vendorAuth = (req, res, next) => {
  const vendorPassword = req.headers['x-vendor-password'];
  
  // TODO: Replace with secure authentication
  if (vendorPassword === process.env.VENDOR_PASSWORD || vendorPassword === 'vendor123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized vendor access' });
  }
};

// Get all student submissions
router.get('/submissions', vendorAuth, async (req, res) => {
  try {
    const folders = await getAllStudentFolders();
    
    const submissions = await Promise.all(
      folders.map(async (folderName) => {
        try {
          const contents = await getStudentFolderContents(folderName);
          return {
            folderName,
            studentName: contents.studentDetails?.studentInfo?.name || 'Unknown',
            college: contents.studentDetails?.studentInfo?.college || 'Unknown',
            projectTitle: contents.studentDetails?.projectInfo?.title || 'Unknown',
            submittedDate: contents.studentDetails?.projectInfo?.submittedDate,
            totalPages: contents.studentDetails?.projectInfo?.totalPages,
            copies: contents.studentDetails?.printingDetails?.copies,
            paymentStatus: contents.studentDetails?.pricing?.paymentStatus,
            fileCount: contents.files.length
          };
        } catch (err) {
          return {
            folderName,
            error: 'Could not read folder details'
          };
        }
      })
    );
    
    res.json({
      totalSubmissions: submissions.length,
      submissions: submissions.sort((a, b) => 
        new Date(b.submittedDate) - new Date(a.submittedDate)
      )
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get specific student folder contents
router.get('/submission/:folderName', vendorAuth, async (req, res) => {
  try {
    const { folderName } = req.params;
    const contents = await getStudentFolderContents(folderName);
    
    res.json(contents);
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    res.status(404).json({ error: 'Folder not found' });
  }
});

// Download specific file from student folder
router.get('/download/:folderName/:fileName', vendorAuth, async (req, res) => {
  try {
    const { folderName, fileName } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', folderName, fileName);
    
    // Check if file exists
    await fs.access(filePath);
    
    res.download(filePath, fileName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

// Download entire student folder as ZIP
router.get('/download-folder/:folderName', vendorAuth, async (req, res) => {
  try {
    const { folderName } = req.params;
    const folderPath = path.join(__dirname, '..', 'uploads', folderName);
    
    // Check if folder exists
    await fs.access(folderPath);
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${folderName}.zip"`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create archive' });
    });
    
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
    
  } catch (error) {
    console.error('Error creating folder archive:', error);
    res.status(404).json({ error: 'Folder not found' });
  }
});

// Get pending orders (paid but not completed)
router.get('/pending-orders', vendorAuth, async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        users (name, email, college, department, phone)
      `)
      .eq('payment_status', 'paid')
      .neq('status', 'completed')
      .order('submitted_date', { ascending: false });
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch pending orders' });
    }
    
    res.json({
      totalPending: projects.length,
      orders: projects
    });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update project status (vendor marks as completed)
router.put('/update-status/:projectId', vendorAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, notes } = req.body;
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: status,
        vendor_notes: notes,
        completed_date: status === 'completed' ? new Date() : null,
        updated_at: new Date()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to update status' });
    }
    
    res.json({
      success: true,
      message: 'Project status updated',
      project: data
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics for vendor dashboard
router.get('/stats', vendorAuth, async (req, res) => {
  try {
    const { data: allProjects } = await supabase
      .from('projects')
      .select('status, payment_status, total_amount');
    
    const stats = {
      total: allProjects.length,
      pending: allProjects.filter(p => p.status === 'pending').length,
      inProgress: allProjects.filter(p => p.status === 'in-progress').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      paid: allProjects.filter(p => p.payment_status === 'paid').length,
      unpaid: allProjects.filter(p => p.payment_status === 'pending').length,
      totalRevenue: allProjects
        .filter(p => p.payment_status === 'paid')
        .reduce((sum, p) => sum + (p.total_amount || 0), 0)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
