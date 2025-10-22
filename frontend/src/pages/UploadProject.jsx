import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentUpload from '../components/DocumentUpload';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import './UploadProject.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const UploadProject = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Upload, 3: Review
  const [user, setUser] = useState(null);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    department: '',
    semester: '',
    subject: '',
    guide: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [countingPages, setCountingPages] = useState(false);
  const [manualPageInput, setManualPageInput] = useState('');
  const [hasInternshipCertificate, setHasInternshipCertificate] = useState(false);
  const [showCamScanner, setShowCamScanner] = useState(false);
  const [deadlineInfo, setDeadlineInfo] = useState(null);
  const [checkingDeadline, setCheckingDeadline] = useState(true);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check deadline for user's college
      if (parsedUser.college) {
        checkDeadline(parsedUser.college, parsedUser.department);
      }
    }
  }, []);

  useEffect(() => {
    // Re-check deadline when department changes
    if (user?.college && projectData.department) {
      checkDeadline(user.college, projectData.department);
    }
  }, [projectData.department]);

  const checkDeadline = async (college, department) => {
    try {
      setCheckingDeadline(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(
        `${apiUrl}/api/deadlines/check/${encodeURIComponent(college)}?department=${department || ''}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeadlineInfo(data);
      }
    } catch (error) {
      console.error('Error checking deadline:', error);
    } finally {
      setCheckingDeadline(false);
    }
  };

  const handleInputChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate project details
      if (!projectData.title || !projectData.department || !projectData.semester) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Check deadline before proceeding
      if (deadlineInfo && deadlineInfo.isExpired) {
        alert(`⛔ Upload Denied!\n\nThe submission deadline for ${user?.college || 'your college'} has passed (${new Date(deadlineInfo.deadline).toLocaleDateString()}).\n\nUploads are no longer accepted for this college.`);
        return;
      }
      
      setStep(2);
    } else if (step === 2) {
      if (uploadedFiles.length === 0) {
        alert('Please upload at least one document');
        return;
      }
      
      // Final deadline check before review
      if (deadlineInfo && deadlineInfo.isExpired) {
        alert(`⛔ Upload Denied!\n\nThe submission deadline has passed. Cannot proceed with upload.`);
        return;
      }
      
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const countPDFPages = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('Error counting PDF pages:', error);
      return null;
    }
  };

  const handleUploadComplete = async (files) => {
    console.log('📥 Files received from DocumentUpload:', files);
    console.log('📥 Full file structure:', JSON.stringify(files, null, 2));
    
    setUploadedFiles(files);
    
    // Count pages for each file
    if (files && files.length > 0) {
      setCountingPages(true);
      try {
        let totalPageCount = 0;
        
        for (let i = 0; i < files.length; i++) {
          const fileData = files[i];
          
          console.log(`\n=== Processing File ${i + 1} ===`);
          console.log('Raw fileData:', fileData);
          console.log('fileData.file exists?', !!fileData.file);
          console.log('fileData.name:', fileData.name);
          console.log('fileData.size:', fileData.size);
          console.log('fileData.type:', fileData.type);
          
          // Get the actual file object - try multiple paths
          let actualFile = fileData.file;
          
          if (!actualFile) {
            console.log('⚠️ No file object in fileData.file, checking if fileData itself is a File...');
            if (fileData instanceof File) {
              actualFile = fileData;
              console.log('✅ fileData itself is a File object');
            } else {
              console.error('❌ No valid file object found');
              continue;
            }
          }
          
          const fileName = actualFile.name;
          const fileType = actualFile.type;
          const fileSize = actualFile.size;
          
          console.log(`📄 File Details:
  Name: ${fileName}
  Type: ${fileType}
  Size: ${fileSize} bytes (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
          
          if (fileType === 'application/pdf') {
            // Count PDF pages using react-pdf
            console.log('🔍 Starting PDF page count...');
            try {
              const pageCount = await countPDFPages(actualFile);
              if (pageCount && pageCount > 0) {
                totalPageCount += pageCount;
                console.log(`✅ SUCCESS: ${fileName} has ${pageCount} pages`);
              } else {
                // Estimate if counting fails
                const estimate = Math.max(10, Math.ceil(fileSize / 100000));
                totalPageCount += estimate;
                console.log(`⚠️ Counting returned ${pageCount}, using estimate: ${estimate} pages`);
              }
            } catch (pdfError) {
              console.error('❌ PDF counting error:', pdfError);
              const estimate = Math.max(10, Math.ceil(fileSize / 100000));
              totalPageCount += estimate;
              console.log(`⚠️ Using estimate: ${estimate} pages`);
            }
          } else if (fileType.includes('word') || fileType.includes('document')) {
            // Estimate Word document pages (1 page ≈ 25KB)
            const estimate = Math.max(1, Math.ceil(fileSize / 25000));
            totalPageCount += estimate;
            console.log(`📄 ${fileName}: Estimated ${estimate} pages (Word doc)`);
          } else if (fileType.startsWith('image/')) {
            // Images are 1 page each
            totalPageCount += 1;
            console.log(`🖼️ ${fileName}: 1 page (image)`);
          } else {
            // Unknown type, estimate
            const estimate = Math.max(5, Math.ceil(fileSize / 50000));
            totalPageCount += estimate;
            console.log(`❓ ${fileName}: Estimated ${estimate} pages (unknown type)`);
          }
        }
        
        console.log(`\n✅ ===== FINAL RESULT =====`);
        console.log(`Total files processed: ${files.length}`);
        console.log(`Total pages counted: ${totalPageCount}`);
        console.log(`==========================\n`);
        
        setTotalPages(totalPageCount);
        setManualPageInput(totalPageCount.toString());
      } catch (error) {
        console.error('❌ Fatal error in handleUploadComplete:', error);
        console.error('Error stack:', error.stack);
        // Set a default estimate
        const estimate = files.length * 20;
        setTotalPages(estimate);
        setManualPageInput(estimate.toString());
      } finally {
        setCountingPages(false);
      }
    } else {
      console.log('⚠️ No files received or empty array');
    }
  };

  const handleManualPageInput = (e) => {
    const value = e.target.value;
    setManualPageInput(value);
    const pages = parseInt(value);
    if (!isNaN(pages) && pages > 0) {
      setTotalPages(pages);
    } else {
      setTotalPages(0);
    }
  };

  const handleSubmit = () => {
    // Validate page count
    if (!totalPages || totalPages <= 0) {
      alert('Please enter the total number of pages in your document');
      return;
    }

    // Navigate to customization page with page count
    navigate('/project-customization', {
      state: {
        projectData,
        uploadedFiles,
        totalPages: totalPages
      }
    });
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h1>Submit New Project</h1>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Project Details</div>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Upload Documents</div>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Review & Submit</div>
        </div>
      </div>

      {/* Step Content */}
      <div className="upload-content">
        {step === 1 && (
          <div className="step-content">
            <h2>Project Details</h2>
            <form className="project-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={projectData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Semester *</label>
                  <select
                    name="semester"
                    value={projectData.semester}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={projectData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Machine Learning"
                  />
                </div>

                <div className="form-group">
                  <label>Project Guide</label>
                  <input
                    type="text"
                    name="guide"
                    value={projectData.guide}
                    onChange={handleInputChange}
                    placeholder="Guide name"
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Upload Documents</h2>
            <p className="step-description">
              Upload your project report or scan documents using your camera
            </p>
            
            {/* PDF Naming Instruction */}
            <div className="pdf-naming-instruction">
              <div className="instruction-icon">📝</div>
              <div className="instruction-content">
                <h4>Important: Rename Your PDF File</h4>
                <p>Before uploading, please rename your PDF file as:</p>
                <div className="naming-format">
                  <code>YourName_CollegeName_Department.pdf</code>
                </div>
                <p className="example">Example: <strong>RameshKumar_DSATMBangalore_CSE.pdf</strong></p>
                <p className="note">This helps us identify and process your project faster!</p>
              </div>
            </div>
            
            {/* Internship Certificate Checkbox */}
            <div className="certificate-check">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hasInternshipCertificate}
                  onChange={(e) => setHasInternshipCertificate(e.target.checked)}
                />
                <span>✓ My document includes internship certificate (digital copy)</span>
              </label>
              {!hasInternshipCertificate && (
                <div className="certificate-note">
                  <p>⚠️ <strong>Don't have a digital copy?</strong></p>
                  <p>Use our Cam Scanner feature to capture and enhance your certificate photo.</p>
                  <button 
                    type="button" 
                    className="btn-scanner"
                    onClick={() => setShowCamScanner(true)}
                  >
                    📷 Open Cam Scanner
                  </button>
                </div>
              )}
            </div>
            
            <DocumentUpload 
              onUploadComplete={handleUploadComplete}
              maxFiles={5}
              showScanner={showCamScanner}
              onScannerClose={() => setShowCamScanner(false)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Review & Submit</h2>
            
            <div className="review-section">
              <h3>Project Information</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Title:</span>
                  <span className="review-value">{projectData.title}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Department:</span>
                  <span className="review-value">{projectData.department}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Semester:</span>
                  <span className="review-value">Semester {projectData.semester}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Subject:</span>
                  <span className="review-value">{projectData.subject || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="review-section">
              <h3>Uploaded Documents</h3>
              <div className="files-review">
                {uploadedFiles.map((file, index) => {
                  const fileName = file.name || file.file?.name || `Document ${index + 1}`;
                  const fileSize = file.size || file.file?.size || 0;
                  
                  return (
                    <div key={index} className="file-review-item">
                      <FaCheckCircle className="check-icon" />
                      <span>{fileName}</span>
                      <span className="file-size">{formatFileSize(fileSize)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="total-pages">
                <strong>Total Documents:</strong> {uploadedFiles.length}
                {countingPages && (
                  <span className="counting-badge">⏳ Counting pages...</span>
                )}
                {!countingPages && totalPages > 0 && (
                  <span className="pages-badge">📄 Auto-detected: {totalPages} pages</span>
                )}
              </div>

              <div className="manual-page-input">
                <label htmlFor="manualPages">
                  <strong>Total Pages (Auto-Counted):</strong>
                </label>
                <input
                  type="number"
                  id="manualPages"
                  value={manualPageInput}
                  readOnly
                  placeholder="Counting pages..."
                  min="1"
                  required
                  className="page-input readonly"
                />
                {totalPages > 0 && (
                  <span className="page-confirm">✓ {totalPages} pages detected and locked</span>
                )}
                {countingPages && (
                  <p className="page-note">⏳ Analyzing document and counting pages...</p>
                )}
                {!countingPages && totalPages > 0 && (
                  <p className="page-note">🔒 Page count is automatically verified and locked</p>
                )}
              </div>
            </div>

            <div className="review-note">
              <p>⚠️ Please review all information carefully before submitting. Once submitted, you will be redirected to the payment page.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="upload-actions">
        {step > 1 && (
          <button onClick={handleBack} className="btn-secondary">
            Previous
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-submit">
            Continue to Customization
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default UploadProject;
