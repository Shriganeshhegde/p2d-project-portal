import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCopy, FaPrint, FaFileAlt, FaBook, FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import './ProjectCustomization.css';

const ProjectCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectData, uploadedFiles, totalPages } = location.state || {};

  const [customization, setCustomization] = useState({
    copies: 1,
    printType: 'color', // Fixed: Color only
    paperType: 'bond-paper', // Fixed: Bond paper only
    bindingType: 'hardcover', // Fixed: Hard binding only
    bindingColor: 'royal-blue' // Default binding color
  });

  // Fixed specifications for projects
  const projectSpecs = {
    printType: 'Color Print',
    paperType: 'Bond Paper',
    bindingType: 'Hard Binding'
  };

  const bindingColors = [
    { 
      id: 'royal-blue', 
      name: 'Royal Blue', 
      color: '#1e3a8a', 
      image: '/images/binding-colors/royal-blue.jpg',
      description: 'PS 588 BUCKRAM Royal Blue'
    },
    { 
      id: 'green', 
      name: 'Dark Green', 
      color: '#15803d', 
      image: '/images/binding-colors/green.jpg',
      description: 'LEVANT 900 Dark Green'
    },
    { 
      id: 'maroon', 
      name: 'Maroon', 
      color: '#7c2d12', 
      image: '/images/binding-colors/maroon.jpg',
      description: 'PS 192 BUCKRAM Maroon'
    },
    { 
      id: 'black', 
      name: 'Black', 
      color: '#1f2937', 
      image: '/images/binding-colors/black.jpg',
      description: 'LEVANT 898 Black'
    }
  ];

  const handleChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProceedToPayment = () => {
    // Use the totalPages passed from upload or calculate
    const pages = totalPages || uploadedFiles?.reduce((sum, file) => sum + (file.pages || 10), 0) || 45;
    
    navigate('/payment-details', {
      state: {
        projectData,
        uploadedFiles,
        customization,
        totalPages: pages
      }
    });
  };

  return (
    <div className="customization-container">
      <div className="customization-header">
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h1>Customize Your Project</h1>
        <p>Choose printing and binding options</p>
      </div>

      <div className="customization-content">
        {/* Number of Copies */}
        <div className="custom-section">
          <div className="section-header">
            <FaCopy />
            <h2>Number of Copies</h2>
          </div>
          <div className="copies-selector">
            <button 
              onClick={() => handleChange('copies', Math.max(1, customization.copies - 1))}
              className="copy-btn"
            >
              -
            </button>
            <div className="copy-display">
              <span className="copy-number">{customization.copies}</span>
              <span className="copy-label">Copies</span>
            </div>
            <button 
              onClick={() => handleChange('copies', Math.min(10, customization.copies + 1))}
              className="copy-btn"
            >
              +
            </button>
          </div>
          <p className="section-note">Maximum 10 copies per order</p>
        </div>

        {/* Fixed Specifications */}
        <div className="custom-section">
          <div className="section-header">
            <FaPrint />
            <h2>Project Specifications (Fixed)</h2>
          </div>
          <div className="fixed-specs">
            <div className="spec-item">
              <span className="spec-icon">🎨</span>
              <div className="spec-info">
                <h3>Print Type</h3>
                <p>{projectSpecs.printType}</p>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📄</span>
              <div className="spec-info">
                <h3>Paper Type</h3>
                <p>{projectSpecs.paperType}</p>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📕</span>
              <div className="spec-info">
                <h3>Binding Type</h3>
                <p>{projectSpecs.bindingType}</p>
              </div>
            </div>
          </div>
          <div className="spec-note">
            <p>✓ All projects use premium specifications for best quality</p>
          </div>
        </div>

        {/* Binding Color */}
        <div className="custom-section">
          <div className="section-header">
            <FaBook />
            <h2>Binding Color</h2>
          </div>
          <div className="color-grid">
            {bindingColors.map(color => (
              <div
                key={color.id}
                className={`color-card ${customization.bindingColor === color.id ? 'selected' : ''}`}
                onClick={() => handleChange('bindingColor', color.id)}
              >
                <div className="color-image-wrapper">
                  <img 
                    src={color.image} 
                    alt={color.name}
                    className="binding-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = color.color;
                    }}
                  />
                  {customization.bindingColor === color.id && (
                    <div className="selected-badge">
                      <FaCheckCircle /> Selected
                    </div>
                  )}
                </div>
                <div className="color-info">
                  <h3>{color.name}</h3>
                  <p className="color-description">{color.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="custom-section summary-section">
          <h2>Order Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Copies:</span>
              <span className="value">{customization.copies}</span>
            </div>
            <div className="summary-item">
              <span className="label">Print Type:</span>
              <span className="value">{projectSpecs.printType}</span>
            </div>
            <div className="summary-item">
              <span className="label">Paper:</span>
              <span className="value">{projectSpecs.paperType}</span>
            </div>
            <div className="summary-item">
              <span className="label">Binding:</span>
              <span className="value">{projectSpecs.bindingType}</span>
            </div>
            <div className="summary-item">
              <span className="label">Binding Color:</span>
              <span className="value">
                {bindingColors.find(c => c.id === customization.bindingColor)?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="customization-actions">
        <button onClick={handleBack} className="btn-secondary">
          <FaArrowLeft /> Back
        </button>
        <button onClick={handleProceedToPayment} className="btn-primary">
          Proceed to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ProjectCustomization;
