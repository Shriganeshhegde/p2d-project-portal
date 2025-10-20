import React, { useEffect, useState } from 'react';
import './AnimatedLogo.css';

const AnimatedLogo = ({ size = 'large', showText = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`animated-logo-container ${size} ${isLoaded ? 'loaded' : ''}`}>
      <div className="logo-wrapper">
        {/* Animated rings around logo */}
        <div className="logo-ring ring-1"></div>
        <div className="logo-ring ring-2"></div>
        <div className="logo-ring ring-3"></div>
        
        {/* Logo image */}
        <div className="logo-image-wrapper">
          <img 
            src="/images/logo.png" 
            alt="P2D Logo" 
            className="logo-image"
            onError={(e) => {
              // Fallback: Show P2D text if logo not found
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'logo-fallback';
              fallback.innerHTML = '<span class="p2d-text">P2D</span>';
              e.target.parentElement.appendChild(fallback);
            }}
          />
        </div>
        
      </div>
      
      {showText && (
        <div className="logo-text">
          <h1 className="logo-title">P2D - Project to Door</h1>
          <p className="logo-subtitle">by P2D Solutions</p>
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
