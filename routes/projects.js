const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileUploader = require('../utils/fileUpload');
const { supabase } = require('../utils/supabase');
const auth = require('../middleware/auth');

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

// Middleware to handle file upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Submit a new project with document
router.post('/', auth, upload.single('document'), handleUploadErrors, async (req, res) => {
  try {
    const { title, description, department, semester } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload the main document
    const fileInfo = await fileUploader.uploadFile(
      {
        ...req.file,
        originalname: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}${path.extname(req.file.originalname)}`
      },
      userId,
      'projects'
    );

    // Create project in database
    const { data: project, error } = await supabase
      .from('projects')
      .insert([
        {
          student_id: userId,
          title,
          description,
          department,
          semester: parseInt(semester, 10),
          status: 'submitted',
          payment_status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Create document record
    await supabase
      .from('project_documents')
      .insert([
        {
          project_id: project.id,
          name: fileInfo.fileName,
          path: fileInfo.filePath,
          size: fileInfo.size,
          mime_type: fileInfo.mimeType
        }
      ]);

    res.status(201).json({
      ...project,
      document: {
        name: fileInfo.fileName,
        url: fileInfo.publicUrl,
        mimeType: fileInfo.mimeType,
        size: fileInfo.size
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all projects for the authenticated student
router.get('/my-projects', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_documents (
          id,
          name,
          path,
          size,
          mime_type,
          uploaded_at
        )
      `)
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to include document URLs
    const projectsWithUrls = await Promise.all(projects.map(async (project) => {
      const documents = await Promise.all(
        (project.project_documents || []).map(async (doc) => ({
          ...doc,
          url: await fileUploader.getFileUrl(doc.path)
        }))
      );

      return {
        ...project,
        documents
      };
    }));

    res.json(projectsWithUrls);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Upload additional documents for a project
router.post(
  '/:projectId/documents',
  auth,
  upload.array('documents', 5),
  handleUploadErrors,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Verify the project belongs to the user
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('student_id', userId)
        .single();

      if (projectError || !project) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Upload all files
      const uploadPromises = req.files.map(file => 
        fileUploader.uploadFile(file, userId, `projects/${projectId}/additional`)
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // Save document records
      const documentRecords = uploadedFiles.map(file => ({
        project_id: projectId,
        name: file.fileName,
        path: file.filePath,
        size: file.size,
        mime_type: file.mimeType
      }));

      const { error: insertError } = await supabase
        .from('project_documents')
        .insert(documentRecords);

      if (insertError) throw insertError;

      // Get updated project with all documents
      const { data: updatedProject, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          project_documents (
            id,
            name,
            path,
            size,
            mime_type,
            is_primary,
            uploaded_at
          )
        `)
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      // Add URLs to the documents
      const documents = await Promise.all(
        (updatedProject.project_documents || []).map(async (doc) => ({
          ...doc,
          url: await fileUploader.getFileUrl(doc.path)
        }))
      );

      res.json({
        ...updatedProject,
        documents,
        document: documents.find(doc => doc.is_primary) || null
      });
    } catch (error) {
      console.error('Error uploading documents:', error);
      res.status(500).json({ 
        error: 'Failed to upload documents',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get a single project with documents
router.get('/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_documents (
          id,
          name,
          path,
          size,
          mime_type,
          uploaded_at
        )
      `)
      .eq('id', projectId)
      .eq('student_id', userId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add URLs to the documents
    const documents = await Promise.all(
      (project.project_documents || []).map(async (doc) => ({
        ...doc,
        url: await fileUploader.getFileUrl(doc.path)
      }))
    );

    res.json({
      ...project,
      documents,
      document: documents.find(doc => doc.is_primary) || null
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete a document
router.delete('/documents/:documentId', auth, async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // First, get the document to check permissions
    const { data: document, error: docError } = await supabase
      .from('project_documents')
      .select('*, projects(student_id)')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if the document belongs to the user's project
    if (document.projects.student_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this document' });
    }

    // Document can be deleted

    // Delete from storage
    await fileUploader.deleteFile(document.path);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('project_documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) throw deleteError;

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
