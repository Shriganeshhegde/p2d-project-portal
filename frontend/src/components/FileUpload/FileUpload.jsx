import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaTrash, FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import axios from 'axios';
import './FileUpload.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * FileUpload Component
 * 
 * A drag-and-drop file upload component with preview functionality for images and PDFs.
 * Supports multiple file uploads with progress tracking and file validation.
 * 
 * Features:
 * - Drag and drop file upload
 * - File type and size validation
 * - Image and PDF preview
 * - Upload progress tracking
 * - Batch file upload
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onUploadComplete - Callback function called when files are successfully uploaded
 * @param {number} [props.maxFiles=5] - Maximum number of files allowed
 * @param {number} [props.maxSizeMB=10] - Maximum file size in megabytes
 * @param {string[]} [props.allowedTypes] - Array of allowed MIME types
 * 
 * @example
 * ```jsx
 * <FileUpload
 *   onUploadComplete={(files) => console.log('Uploaded:', files)}
 *   maxFiles={5}
 *   maxSizeMB={10}
 *   allowedTypes={['application/pdf', 'image/jpeg']}
 * />
 * ```
 */
const FileUpload = ({ onUploadComplete, maxFiles = 5, maxSizeMB = 10, allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'] }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, [files.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.join(','),
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(Array.from(e.target.files));
      e.target.value = ''; // Reset file input
    }
  };

  const removeFile = (id) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.id !== id);
      // Revoke object URL to avoid memory leaks
      const removedFile = prevFiles.find(file => file.id === id);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
  };

  const getFileIcon = (fileType) => {
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const uploadFile = async (fileData) => {
    const formData = new FormData();
    formData.append('document', fileData.file);
    formData.append('title', fileData.file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    formData.append('description', 'Uploaded via file upload');
    formData.append('department', 'General');
    formData.append('semester', '1');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${apiUrl}/api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token || ''
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            [fileData.id]: progress
          }));
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Status:', error.response?.status);
      return { success: false, error };
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload first!');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress({});
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Demo mode - simulate upload without backend
      console.log('Demo mode: Simulating file upload for', files.length, 'files');
      
      // Simulate upload progress for each file
      const progressIntervals = [];
      files.forEach((fileData) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(prev => ({
            ...prev,
            [fileData.id]: Math.min(progress, 100)
          }));
          
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
        progressIntervals.push(interval);
      });
      
      // Wait for simulation to complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear all intervals
      progressIntervals.forEach(interval => clearInterval(interval));
      
      // Call onUploadComplete with file data (including actual file object)
      if (onUploadComplete) {
        const uploadedData = files.map(f => ({
          id: f.id,
          name: f.file.name,
          size: f.file.size,
          type: f.file.type,
          preview: f.preview,
          file: f.file // Include actual file object for page counting
        }));
        onUploadComplete(uploadedData);
      }
      
      alert(`✅ ${files.length} file(s) uploaded successfully!\n\n(Demo Mode - Files saved locally. Login to upload to server)`);
      setFiles([]);
      setIsUploading(false);
      return;
    }
    
    // Real upload mode
    const uploadPromises = files.map(fileData => uploadFile(fileData));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);
      
      // Check if all uploads failed due to connection error
      if (successfulUploads.length === 0 && failedUploads.length > 0) {
        const firstError = failedUploads[0].error;
        
        // Check if it's a connection error
        if (firstError.code === 'ERR_NETWORK' || firstError.message.includes('Network Error')) {
          alert('❌ Cannot connect to server!\n\nBackend is not running. Please:\n1. Start backend: npm run dev\n2. Or logout to use Demo Mode');
          setIsUploading(false);
          return;
        }
      }
      
      if (successfulUploads.length > 0 && onUploadComplete) {
        // Include the original file object for page counting
        const uploadsWithFiles = successfulUploads.map((upload, index) => ({
          ...upload.data,
          file: files[index].file, // Attach original file object
          name: files[index].file.name,
          size: files[index].file.size,
          type: files[index].file.type
        }));
        onUploadComplete(uploadsWithFiles);
      }
      
      // Clear successfully uploaded files
      setFiles(prevFiles => 
        prevFiles.filter(file => 
          !results.some((result, index) => 
            result.success && files[index].id === file.id
          )
        )
      );
      
      if (successfulUploads.length > 0) {
        alert(`✅ ${successfulUploads.length} file(s) uploaded successfully!`);
      }
      
      if (failedUploads.length > 0 && successfulUploads.length > 0) {
        alert(`⚠️ ${successfulUploads.length} succeeded, ${failedUploads.length} failed`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('❌ Error uploading files. Please check if backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePreview = (file) => {
    if (file.file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file.file));
    } else if (file.file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file.file);
      setPreviewUrl(fileUrl);
    } else {
      // For other file types, just show a message
      alert(`Preview not available for ${file.file.name}. File type: ${file.file.type}`);
    }
  };

  return (
    <div className="file-upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <FaUpload className="upload-icon" />
          <p>Drag & drop files here, or <button 
            type="button" 
            className="browse-btn"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            browse
          </button></p>
          <p className="file-types">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max {maxSizeMB}MB per file)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            multiple
            accept={allowedTypes.join(',')}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Files to Upload ({files.length}/{maxFiles})</h3>
            <button 
              onClick={handleUpload} 
              className="upload-btn"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload All (${files.length})`}
            </button>
          </div>
          
          <div className="file-items">
            {files.map((fileData) => (
              <div key={fileData.id} className="file-item">
                <div className="file-info" onClick={() => openFilePreview(fileData)}>
                  <div className="file-icon-container">
                    {fileData.preview ? (
                      <img 
                        src={fileData.preview} 
                        alt={fileData.file.name} 
                        className="file-thumbnail"
                      />
                    ) : (
                      getFileIcon(fileData.file.type)
                    )}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{fileData.file.name}</div>
                    <div className="file-meta">
                      <span>{formatFileSize(fileData.file.size)}</span>
                      <span className="file-type">{fileData.file.type}</span>
                    </div>
                    {uploadProgress[fileData.id] > 0 && (
                      <div className="progress-container">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${uploadProgress[fileData.id]}%` }}
                        ></div>
                        <span className="progress-text">{uploadProgress[fileData.id]}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileData.id);
                  }}
                  disabled={isUploading}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>File Preview</h3>
              <button onClick={() => setPreviewUrl(null)}>×</button>
            </div>
            <div className="preview-body">
              {previewUrl.endsWith('.pdf') ? (
                <div className="pdf-preview">
                  <Document
                    file={previewUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  {numPages > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                      >
                        Previous
                      </button>
                      <span>Page {pageNumber} of {numPages}</span>
                      <button 
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="image-preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
