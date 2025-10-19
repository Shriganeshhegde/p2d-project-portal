const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabase } = require('../utils/supabase');
const auth = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload file to Supabase Storage
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const userId = req.user.id;
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}-${file.originalname}`;

    console.log(`Uploading file: ${fileName}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ 
        error: 'Failed to upload file',
        details: error.message 
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('project-documents')
      .getPublicUrl(fileName);

    console.log(`✅ File uploaded: ${fileName}`);

    res.json({
      success: true,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      storagePath: fileName,
      publicUrl: urlData.publicUrl
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

// Get file from Supabase Storage
router.get('/download/:path(*)', auth, async (req, res) => {
  try {
    const filePath = req.params.path;
    
    console.log(`Downloading file: ${filePath}`);

    // Download from Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-documents')
      .download(filePath);

    if (error) {
      console.error('Supabase download error:', error);
      return res.status(404).json({ 
        error: 'File not found',
        details: error.message 
      });
    }

    // Send file
    res.setHeader('Content-Type', data.type);
    res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
    res.send(Buffer.from(await data.arrayBuffer()));

  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ 
      error: 'Failed to download file',
      details: error.message 
    });
  }
});

module.exports = router;
