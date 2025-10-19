import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaCrop, FaMagic, FaFileUpload, FaTimes, FaCheck, FaRedo } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import * as Tesseract from 'tesseract.js';
import './DocumentScanner.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * DocumentScanner Component
 * 
 * A CamScanner-like document scanning component that provides:
 * - Camera access for document capture
 * - Image enhancement and filtering
 * - OCR text extraction using Tesseract.js
 * - Multiple camera support (front/back)
 * - Real-time filter preview
 * 
 * Features:
 * - Live camera preview with filters
 * - Capture and enhance documents
 * - OCR text extraction
 * - Image comparison (original vs enhanced)
 * - Adjustable brightness, contrast, grayscale, and sepia filters
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onScanComplete - Callback function called when scanning is complete
 * @param {Function} props.onClose - Callback function to close the scanner
 * 
 * @example
 * ```jsx
 * <DocumentScanner
 *   onScanComplete={(scannedDoc) => console.log('Scanned:', scannedDoc)}
 *   onClose={() => setShowScanner(false)}
 * />
 * ```
 */
const DocumentScanner = ({ onScanComplete, onClose }) => {
  const [mode, setMode] = useState('camera'); // 'camera', 'preview', 'edit', 'result'
  const [imageData, setImageData] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [flashMode, setFlashMode] = useState('off');
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode, facingMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { exact: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Apply filters before capturing
    ctx.filter = getFilterStyle();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageData(imageDataUrl);
    setMode('preview');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const getFilterStyle = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;
  };

  const applyEnhancement = () => {
    if (!imageData) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Apply auto-enhancement (simple contrast and brightness adjustment)
      ctx.filter = `contrast(110%) brightness(105%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      setEnhancedImage(canvas.toDataURL('image/jpeg', 0.9));
      setMode('edit');
    };
    img.src = imageData;
  };

  const processImageWithOCR = async () => {
    if (!imageData) return;
    
    setIsOcrProcessing(true);
    setOcrText('');
    
    try {
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      setOcrText(result.data.text);
      setMode('result');
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Error processing text recognition. Please try again.');
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const saveDocument = () => {
    const finalImage = enhancedImage || imageData;
    if (onScanComplete) {
      onScanComplete({
        image: finalImage,
        text: ocrText,
        timestamp: new Date().toISOString()
      });
    }
    onClose();
  };

  const renderCameraView = () => (
    <div className="camera-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-preview"
        style={{ filter: getFilterStyle() }}
      />
      
      <div className="camera-controls">
        <button 
          className="camera-btn flip-btn"
          onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
          title="Flip Camera"
        >
          <FaRedo />
        </button>
        
        <button 
          className="camera-btn capture-btn"
          onClick={captureImage}
          title="Capture"
        >
          <FaCamera />
        </button>
        
        <button 
          className="camera-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image"
        >
          <FaFileUpload />
        </button>
        
        <button 
          className="camera-btn close-btn"
          onClick={onClose}
          title="Close"
        >
          <FaTimes />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Brightness</label>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.brightness}
            onChange={(e) => setFilters(prev => ({ ...prev, brightness: e.target.value }))}
          />
        </div>
        
        <div className="filter-group">
          <label>Contrast</label>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.contrast}
            onChange={(e) => setFilters(prev => ({ ...prev, contrast: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="preview-container">
      <div className="preview-image-container">
        <img 
          src={imageData} 
          alt="Captured" 
          className="preview-image"
          style={{ filter: getFilterStyle() }}
        />
      </div>
      
      <div className="preview-actions">
        <button 
          className="action-btn retake-btn"
          onClick={() => setMode('camera')}
        >
          <FaTimes /> Retake
        </button>
        
        <button 
          className="action-btn enhance-btn"
          onClick={applyEnhancement}
          disabled={isProcessing}
        >
          <FaMagic /> Enhance
        </button>
        
        <button 
          className="action-btn confirm-btn"
          onClick={processImageWithOCR}
          disabled={isProcessing || isOcrProcessing}
        >
          {isOcrProcessing ? `Processing... ${progress}%` : 'Extract Text'}
        </button>
      </div>
    </div>
  );

  const renderEditView = () => (
    <div className="edit-container">
      <div className="edit-preview">
        <div className="image-comparison">
          <div className="image-container original">
            <h4>Original</h4>
            <img 
              src={imageData} 
              alt="Original" 
              className="comparison-image"
            />
          </div>
          
          <div className="image-container enhanced">
            <h4>Enhanced</h4>
            <img 
              src={enhancedImage} 
              alt="Enhanced" 
              className="comparison-image"
            />
          </div>
        </div>
      </div>
      
      <div className="edit-controls">
        <div className="filter-controls">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="filter-group">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="range"
                min={key === 'brightness' || key === 'contrast' ? 0 : 0}
                max={key === 'brightness' || key === 'contrast' ? 200 : 100}
                value={value}
                onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
              />
              <span>{value}%</span>
            </div>
          ))}
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => setMode('preview')}
          >
            Back
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={processImageWithOCR}
            disabled={isOcrProcessing}
          >
            {isOcrProcessing ? `Processing... ${progress}%` : 'Extract Text'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderResultView = () => (
    <div className="result-container">
      <div className="result-content">
        <div className="result-image">
          <img 
            src={enhancedImage || imageData} 
            alt="Scanned Document" 
            className="scanned-image"
          />
        </div>
        
        <div className="result-text">
          <h3>Extracted Text</h3>
          <div className="text-content">
            {ocrText || 'No text was detected in the image.'}
          </div>
        </div>
      </div>
      
      <div className="result-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => setMode('preview')}
        >
          Back
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={saveDocument}
        >
          Save Document
        </button>
      </div>
    </div>
  );

  return (
    <div className="document-scanner">
      <div className="scanner-header">
        <h2>Document Scanner</h2>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="scanner-content">
        {mode === 'camera' && renderCameraView()}
        {mode === 'preview' && renderPreview()}
        {mode === 'edit' && renderEditView()}
        {mode === 'result' && renderResultView()}
      </div>
    </div>
  );
};

export default DocumentScanner;
