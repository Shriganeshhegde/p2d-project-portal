import React, { useState } from 'react';
import { FaCamera, FaUpload, FaTimes, FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import FileUpload from '../FileUpload/FileUpload';
import DocumentScanner from '../DocumentScanner/DocumentScanner';
import './DocumentUpload.css';

/**
 * DocumentUpload Component
 * 
 * A comprehensive document upload component that provides two methods for document submission:
 * 1. Traditional file upload with drag-and-drop support
 * 2. Document scanning using device camera (CamScanner-like functionality)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onUploadComplete - Callback function called when files are uploaded or scanned
 * @param {number} [props.maxFiles=5] - Maximum number of files allowed
 * @param {string[]} [props.allowedTypes] - Array of allowed MIME types for file uploads
 * 
 * @example
 * ```jsx
 * <DocumentUpload
 *   onUploadComplete={(files) => console.log('Uploaded:', files)}
 *   maxFiles={5}
 *   allowedTypes={['application/pdf', 'image/jpeg']}
 * />
 * ```
 */
const DocumentUpload = ({ onUploadComplete, maxFiles = 5, allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'] }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'scanner'
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesUploaded = (files) => {
    const newFiles = files.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      type: 'upload',
      timestamp: new Date().toISOString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    if (onUploadComplete) {
      onUploadComplete([...uploadedFiles, ...newFiles]);
    }
  };

  const handleScanComplete = (scannedDoc) => {
    const newFile = {
      ...scannedDoc,
      id: Math.random().toString(36).substr(2, 9),
      type: 'scan',
      name: `scan-${new Date().toISOString().slice(0, 10)}.jpg`,
      size: Math.floor(scannedDoc.image.length * 0.75), // Approximate size for base64
      mimeType: 'image/jpeg'
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    setShowScanner(false);
    setActiveTab('upload');
    
    if (onUploadComplete) {
      onUploadComplete([...uploadedFiles, newFile]);
    }
  };

  const removeFile = (id) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    
    if (onUploadComplete) {
      onUploadComplete(updatedFiles);
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'scan') return <FaCamera className="file-icon scan" />;
    
    const fileType = file.mimeType || file.type;
    if (fileType === 'application/pdf') return <FaFilePdf className="file-icon pdf" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FaFileWord className="file-icon doc" />;
    if (fileType.startsWith('image/')) return <FaFileImage className="file-icon image" />;
    return <FaFilePdf className="file-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="document-upload-container">
      <div className="upload-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <FaUpload /> Upload Files
        </button>
        <button 
          className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <FaCamera /> Scan Document
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' ? (
          <div className="file-upload-wrapper">
            <FileUpload 
              onUploadComplete={handleFilesUploaded}
              maxFiles={maxFiles - uploadedFiles.length}
              allowedTypes={allowedTypes}
            />
          </div>
        ) : (
          <div className="scanner-wrapper">
            <DocumentScanner 
              onScanComplete={handleScanComplete}
              onClose={() => setActiveTab('upload')}
            />
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Documents ({uploadedFiles.length}/{maxFiles})</h3>
          <div className="file-list">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-icon-container">
                    {file.type === 'scan' ? (
                      <FaCamera className="file-icon scan" />
                    ) : file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.name} 
                        className="file-thumbnail"
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      <span>{formatFileSize(file.size)}</span>
                      {file.timestamp && (
                        <span className="file-date">
                          {new Date(file.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFile(file.id)}
                  title="Remove file"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
