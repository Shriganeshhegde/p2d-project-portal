const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Count pages in uploaded PDF
router.post('/count-pages', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;

    if (fileType === 'application/pdf') {
      // Parse PDF and get page count
      const data = await pdfParse(fileBuffer);
      const pageCount = data.numpages;
      
      console.log(`PDF analyzed: ${pageCount} pages`);
      
      return res.json({ 
        success: true,
        pages: pageCount,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For Word docs, estimate based on file size
      // Average: 1 page ≈ 25KB
      const estimatedPages = Math.max(1, Math.ceil(req.file.size / 25000));
      
      return res.json({ 
        success: true,
        pages: estimatedPages,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        estimated: true
      });
    } else if (fileType.startsWith('image/')) {
      // Images are 1 page each
      return res.json({ 
        success: true,
        pages: 1,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    console.error('Error counting pages:', error);
    res.status(500).json({ 
      error: 'Failed to count pages',
      details: error.message 
    });
  }
});

module.exports = router;
