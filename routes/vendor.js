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
          const details = contents.studentDetails || {};
          
          return {
            folderName,
            // Student Information
            studentName: details.studentInfo?.name || 'Unknown',
            email: details.studentInfo?.email || 'N/A',
            phone: details.studentInfo?.phone || 'N/A',
            
            // College Information
            college: details.studentInfo?.college || 'Unknown',
            department: details.studentInfo?.department || 'N/A',
            semester: details.projectInfo?.semester || 'N/A',
            
            // Project Information
            projectTitle: details.projectInfo?.title || 'Unknown',
            submittedDate: details.projectInfo?.submittedDate,
            
            // Printing Specifications
            totalPages: details.projectInfo?.totalPages || 0,
            copies: details.printingDetails?.copies || 1,
            printType: details.printingDetails?.printType || 'N/A',
            paperType: details.printingDetails?.paperType || 'N/A',
            bindingType: details.printingDetails?.bindingType || 'N/A',
            bindingColor: details.printingDetails?.bindingColor || 'N/A',
            
            // Payment & Order Information
            paymentStatus: details.pricing?.paymentStatus || 'pending',
            totalAmount: details.pricing?.totalAmount || 0,
            fileName: contents.files?.[0] || 'N/A',
            fileCount: contents.files?.length || 0
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
    
    // Update order status to "Printing in progress" when vendor downloads
    try {
      // Get student details from folder to find the project
      const contents = await getStudentFolderContents(folderName);
      const studentEmail = contents.studentDetails?.studentInfo?.email;
      
      if (studentEmail) {
        // Find the project by student email and update status
        const { data: projects } = await supabase
          .from('projects')
          .select('id, status')
          .eq('user_id', studentEmail)
          .eq('payment_status', 'paid')
          .order('submitted_date', { ascending: false })
          .limit(1);
        
        if (projects && projects.length > 0) {
          const project = projects[0];
          
          // Only update if status is "Order Accepted" or "pending"
          if (project.status === 'Order Accepted' || project.status === 'pending') {
            await supabase
              .from('projects')
              .update({ 
                status: 'Printing in progress',
                updated_at: new Date().toISOString()
              })
              .eq('id', project.id);
            
            console.log(`✅ Order status updated to "Printing in progress" for project ${project.id}`);
          }
        }
      }
    } catch (statusError) {
      // Don't fail the download if status update fails
      console.error('Error updating order status:', statusError);
    }
    
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

// Get all orders (renamed from pending-orders)
router.get('/pending-orders', vendorAuth, async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        users (name, email, college, department)
      `)
      .eq('payment_status', 'paid')
      .order('submission_date', { ascending: false });
    
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    
    res.json({
      total: projects.length,
      orders: projects
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get unique colleges and departments for filters
router.get('/filters', vendorAuth, async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('users(college, department)')
      .eq('payment_status', 'paid');
    
    if (error) throw error;
    
    const colleges = new Set();
    const departments = new Set();
    
    projects.forEach(project => {
      if (project.users?.college) colleges.add(project.users.college);
      if (project.users?.department) departments.add(project.users.department);
    });
    
    res.json({
      colleges: Array.from(colleges).sort(),
      departments: Array.from(departments).sort()
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk download selected orders
router.post('/download-selected', vendorAuth, async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!projectIds || projectIds.length === 0) {
      return res.status(400).json({ error: 'No projects selected' });
    }
    
    // Get all selected projects with files
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*, users(name, college, department)')
      .in('id', projectIds);
    
    if (error) throw error;
    
    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const zipFileName = `Selected_Orders_${Date.now()}.zip`;
    
    res.attachment(zipFileName);
    archive.pipe(res);
    
    // Download files for each project
    for (const project of projects) {
      if (project.file_urls && project.file_urls.length > 0) {
        const studentName = project.users?.name || 'Student';
        const folderName = `${studentName.replace(/\s+/g, '_')}_${project.id.substring(0, 8)}`;
        
        for (const fileInfo of project.file_urls) {
          try {
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('project-documents')
              .download(fileInfo.path);
            
            if (!downloadError && fileData) {
              const buffer = Buffer.from(await fileData.arrayBuffer());
              archive.append(buffer, { name: `${folderName}/${fileInfo.name}` });
            }
          } catch (err) {
            console.error(`Error downloading file ${fileInfo.name}:`, err);
          }
        }
      }
    }
    
    await archive.finalize();
    console.log(`✅ Bulk download completed: ${projectIds.length} projects`);
    
  } catch (error) {
    console.error('Error bulk downloading:', error);
    res.status(500).json({ error: 'Failed to download selected orders' });
  }
});

// Download by college or department filter
router.get('/download-by-filter', vendorAuth, async (req, res) => {
  try {
    const { college, department } = req.query;
    
    let query = supabase
      .from('projects')
      .select('*, users(name, college, department)')
      .eq('payment_status', 'paid');
    
    // Apply filters
    if (college) {
      query = query.eq('users.college', college);
    }
    if (department) {
      query = query.eq('users.department', department);
    }
    
    const { data: projects, error } = await query;
    
    if (error) throw error;
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'No projects found with selected filters' });
    }
    
    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const filterName = college || department || 'Filtered';
    const zipFileName = `${filterName.replace(/\s+/g, '_')}_Orders.zip`;
    
    res.attachment(zipFileName);
    archive.pipe(res);
    
    // Download files for each project
    for (const project of projects) {
      if (project.file_urls && project.file_urls.length > 0) {
        const studentName = project.users?.name || 'Student';
        const folderName = `${studentName.replace(/\s+/g, '_')}_${project.id.substring(0, 8)}`;
        
        for (const fileInfo of project.file_urls) {
          try {
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('project-documents')
              .download(fileInfo.path);
            
            if (!downloadError && fileData) {
              const buffer = Buffer.from(await fileData.arrayBuffer());
              archive.append(buffer, { name: `${folderName}/${fileInfo.name}` });
            }
          } catch (err) {
            console.error(`Error downloading file ${fileInfo.name}:`, err);
          }
        }
      }
    }
    
    await archive.finalize();
    console.log(`✅ Filter download completed: ${projects.length} projects`);
    
  } catch (error) {
    console.error('Error downloading by filter:', error);
    res.status(500).json({ error: 'Failed to download filtered orders' });
  }
});

// Download project files
router.get('/download-files/:projectId', vendorAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Get project with file URLs
    const { data: project, error } = await supabase
      .from('projects')
      .select('*, users(name, email, college, department)')
      .eq('id', projectId)
      .single();
    
    if (error || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.file_urls || project.file_urls.length === 0) {
      return res.status(404).json({ error: 'No files found for this project' });
    }
    
    // If only one file, redirect to it
    if (project.file_urls.length === 1) {
      return res.json({
        singleFile: true,
        url: project.file_urls[0].url,
        name: project.file_urls[0].name
      });
    }
    
    // Multiple files - create ZIP
    const archive = archiver('zip', { zlib: { level: 9 } });
    const studentName = project.users?.name || 'Student';
    const zipFileName = `${studentName.replace(/\s+/g, '_')}_${projectId.substring(0, 8)}.zip`;
    
    res.attachment(zipFileName);
    archive.pipe(res);
    
    // Download each file from Supabase Storage and add to ZIP
    for (const fileInfo of project.file_urls) {
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('project-documents')
          .download(fileInfo.path);
        
        if (!downloadError && fileData) {
          const buffer = Buffer.from(await fileData.arrayBuffer());
          archive.append(buffer, { name: fileInfo.name });
        }
      } catch (err) {
        console.error(`Error downloading file ${fileInfo.name}:`, err);
      }
    }
    
    await archive.finalize();
    console.log(`✅ Files downloaded for project: ${projectId}`);
    
  } catch (error) {
    console.error('Error downloading files:', error);
    res.status(500).json({ error: 'Failed to download files' });
  }
});

// Update project status (vendor marks as completed)
router.put('/update-status/:projectId', vendorAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, notes } = req.body;
    
    console.log(`📝 Updating project ${projectId} status to: ${status}`);
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error updating status:', error);
      return res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
    
    console.log(`✅ Status updated successfully:`, data);
    
    res.json({
      success: true,
      message: 'Project status updated',
      project: data
    });
  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get statistics for vendor dashboard
router.get('/stats', vendorAuth, async (req, res) => {
  try {
    // Get only paid projects with file information
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status, payment_status, file_urls, file_count')
      .eq('payment_status', 'paid');
    
    if (projectsError) throw projectsError;
    
    // Get all payments (we'll filter by project payment_status instead)
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, status, project_id');
    
    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
    }
    
    const allProjects = projects || [];
    const allPayments = payments || [];
    
    console.log('📊 Stats calculation:');
    console.log('Total projects:', allProjects.length);
    console.log('Total payments:', allPayments.length);
    console.log('Payment statuses:', allPayments.map(p => ({ status: p.status, amount: p.amount })));
    
    // Filter projects that have files uploaded
    const projectsWithFiles = allProjects.filter(p => 
      p.file_urls && p.file_urls.length > 0
    );
    
    console.log('Projects with files:', projectsWithFiles.length);
    console.log('Project IDs with files:', projectsWithFiles.map(p => p.id));
    
    // Calculate revenue from payments for projects with files
    // Since project.payment_status = 'paid', the payment is completed
    const totalRevenue = allPayments.reduce((sum, payment) => {
      if (!payment.project_id) {
        console.log(`❌ Skipping payment: no project_id`);
        return sum;
      }
      
      // Check if this payment is for a project with files
      const project = projectsWithFiles.find(p => p.id === payment.project_id);
      
      if (project) {
        const amount = parseFloat(payment.amount) || 0;
        console.log(`✅ Adding payment: ₹${amount} (project: ${payment.project_id.substring(0, 8)}, status: ${payment.status})`);
        return sum + amount;
      } else {
        console.log(`❌ Skipping payment: project ${payment.project_id.substring(0, 8)} - no files or not paid`);
        return sum;
      }
    }, 0);
    
    console.log('Total revenue calculated:', totalRevenue);
    
    // Calculate stats - only for paid projects
    const stats = {
      totalProjects: allProjects.length, // Only paid projects
      pendingProjects: allProjects.filter(p => 
        p.status !== 'Delivered' && p.status !== 'completed'
      ).length, // Paid but not yet delivered
      completedProjects: allProjects.filter(p => 
        p.status === 'Delivered' || p.status === 'completed'
      ).length, // Paid and delivered
      totalRevenue: totalRevenue // Only completed payments for projects with files
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk download by college or department
router.get('/download-bulk/:filterType/:filterValue', vendorAuth, async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    const decodedValue = decodeURIComponent(filterValue);
    
    console.log(`Bulk download requested: ${filterType} = ${decodedValue}`);
    
    // Get all folders
    const folders = await getAllStudentFolders();
    
    // Filter folders based on criteria
    const matchingFolders = [];
    const studentEmailsToUpdate = [];
    
    for (const folderName of folders) {
      try {
        const contents = await getStudentFolderContents(folderName);
        const details = contents.studentDetails || {};
        
        let matches = false;
        if (filterType === 'college') {
          matches = details.studentInfo?.college === decodedValue;
        } else if (filterType === 'department') {
          matches = details.studentInfo?.department === decodedValue;
        }
        
        // Only include paid orders
        if (matches && details.pricing?.paymentStatus === 'paid') {
          matchingFolders.push({
            folderName,
            studentName: details.studentInfo?.name || 'Unknown',
            files: contents.files || []
          });
          
          // Collect student emails for status update
          if (details.studentInfo?.email) {
            studentEmailsToUpdate.push(details.studentInfo.email);
          }
        }
      } catch (err) {
        console.error(`Error reading folder ${folderName}:`, err);
      }
    }
    
    if (matchingFolders.length === 0) {
      return res.status(404).json({ 
        error: `No paid orders found for ${filterType}: ${decodedValue}` 
      });
    }
    
    // Create zip file
    const archive = archiver('zip', { zlib: { level: 9 } });
    const zipFileName = `${filterType}_${decodedValue.replace(/\s+/g, '_')}_${Date.now()}.zip`;
    
    res.attachment(zipFileName);
    archive.pipe(res);
    
    // Add files to zip
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    for (const folder of matchingFolders) {
      const folderPath = path.join(uploadsDir, folder.folderName);
      
      // Add all PDF files from this folder
      for (const file of folder.files) {
        const filePath = path.join(folderPath, file);
        
        try {
          const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
          if (fileExists) {
            // Add file with student name prefix
            const studentPrefix = folder.studentName.replace(/\s+/g, '_');
            archive.file(filePath, { 
              name: `${studentPrefix}/${file}` 
            });
          }
        } catch (err) {
          console.error(`Error adding file ${filePath}:`, err);
        }
      }
    }
    
    await archive.finalize();
    
    // Update order status to "Printing in progress" for all downloaded orders
    if (studentEmailsToUpdate.length > 0) {
      try {
        const { data: updatedProjects } = await supabase
          .from('projects')
          .update({ 
            status: 'Printing in progress',
            updated_at: new Date().toISOString()
          })
          .in('user_id', studentEmailsToUpdate)
          .eq('payment_status', 'paid')
          .in('status', ['Order Accepted', 'pending'])
          .select('id');
        
        console.log(`✅ Updated ${updatedProjects?.length || 0} orders to "Printing in progress"`);
      } catch (statusError) {
        console.error('Error updating bulk order status:', statusError);
      }
    }
    
    console.log(`Bulk download completed: ${matchingFolders.length} orders, ${zipFileName}`);
    
  } catch (error) {
    console.error('Error creating bulk download:', error);
    res.status(500).json({ error: 'Failed to create bulk download' });
  }
});

// Get unique colleges and departments for filtering
router.get('/filters', vendorAuth, async (req, res) => {
  try {
    const folders = await getAllStudentFolders();
    const colleges = new Set();
    const departments = new Set();
    
    for (const folderName of folders) {
      try {
        const contents = await getStudentFolderContents(folderName);
        const details = contents.studentDetails || {};
        
        // Only include paid orders
        if (details.pricing?.paymentStatus === 'paid') {
          if (details.studentInfo?.college) {
            colleges.add(details.studentInfo.college);
          }
          if (details.studentInfo?.department) {
            departments.add(details.studentInfo.department);
          }
        }
      } catch (err) {
        // Skip folders with errors
      }
    }
    
    res.json({
      colleges: Array.from(colleges).sort(),
      departments: Array.from(departments).sort()
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

module.exports = router;
