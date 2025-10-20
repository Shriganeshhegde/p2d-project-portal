import React, { useState } from 'react';
import './OnboardingPopup.css';

const OnboardingPopup = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Welcome to P2D! 🎉",
      subtitle: "Print to Doorstep - Your Project Printing Partner",
      content: [
        {
          icon: "📤",
          title: "Upload Your Project",
          description: "Upload your project documents in PDF or DOC format"
        },
        {
          icon: "🎨",
          title: "Customize",
          description: "Choose print type, binding style, and color options"
        },
        {
          icon: "💳",
          title: "Pay Securely",
          description: "Complete payment through our secure Razorpay gateway"
        },
        {
          icon: "🚚",
          title: "Get it Delivered",
          description: "Receive your professionally printed project at your college"
        }
      ]
    },
    {
      title: "Why Choose P2D? ✨",
      subtitle: "Quality, Affordability, and Reliability",
      content: [
        {
          icon: "💰",
          title: "Lowest Prices",
          description: "Competitive pricing with no hidden charges"
        },
        {
          icon: "✅",
          title: "Quality Assurance",
          description: "High-quality printing and professional binding guaranteed"
        },
        {
          icon: "⏰",
          title: "On-Time Delivery",
          description: "Fast turnaround with delivery tracking"
        },
        {
          icon: "🔒",
          title: "Data Security",
          description: "Your uploaded projects are automatically deleted from our database 7 days after delivery"
        }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="skip-btn" onClick={handleSkip}>Skip</button>
        
        <div className="onboarding-content">
          <h2>{slides[currentSlide].title}</h2>
          <p className="subtitle">{slides[currentSlide].subtitle}</p>

          <div className="features-grid">
            {slides[currentSlide].content.map((item, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className="navigation-buttons">
            {currentSlide > 0 && (
              <button className="btn-secondary" onClick={handlePrevious}>
                Previous
              </button>
            )}
            <button className="btn-primary" onClick={handleNext}>
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPopup;
