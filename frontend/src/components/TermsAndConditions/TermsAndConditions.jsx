import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <div className="terms-header">
          <h2>Terms and Conditions</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="terms-content">
          <h3>Welcome to P2D - Print to Doorstep</h3>
          
          <section>
            <h4>1. Service Description</h4>
            <p>P2D provides project printing and binding services with delivery to your college. By using our service, you agree to these terms.</p>
          </section>

          <section>
            <h4>2. User Responsibilities</h4>
            <ul>
              <li>Provide accurate project details and delivery information</li>
              <li>Ensure uploaded documents are in acceptable formats (PDF, DOC, DOCX)</li>
              <li>Verify customization options before payment</li>
              <li>Make payment through our secure Razorpay gateway</li>
            </ul>
          </section>

          <section>
            <h4>3. Data Privacy & Security</h4>
            <ul>
              <li><strong>Document Storage:</strong> All uploaded project files will be automatically deleted from our database 7 days after delivery</li>
              <li>Your personal information is stored securely and never shared with third parties</li>
              <li>Payment information is processed securely through Razorpay</li>
            </ul>
          </section>

          <section>
            <h4>4. Pricing & Payment</h4>
            <ul>
              <li>Prices are calculated based on pages, copies, print type, and binding options</li>
              <li>Payment must be completed before printing begins</li>
              <li>All prices are in INR and include applicable taxes</li>
            </ul>
          </section>

          <section>
            <h4>5. Delivery</h4>
            <ul>
              <li>Projects will be delivered to your specified college address</li>
              <li>Delivery timelines will be communicated during order placement</li>
              <li>You will receive notifications about order status</li>
            </ul>
          </section>

          <section>
            <h4>6. Quality Assurance</h4>
            <ul>
              <li>We guarantee high-quality printing and professional binding</li>
              <li>If you receive a defective product, contact us within 24 hours</li>
              <li>Replacements will be provided for manufacturing defects</li>
            </ul>
          </section>

          <section>
            <h4>7. Cancellation & Refunds</h4>
            <ul>
              <li>Orders can be cancelled before printing begins</li>
              <li>Refunds will be processed within 5-7 business days</li>
              <li>Once printing has started, cancellation is not possible</li>
            </ul>
          </section>

          <section>
            <h4>8. Acceptable Use</h4>
            <ul>
              <li>Do not upload copyrighted material without permission</li>
              <li>Do not upload offensive or illegal content</li>
              <li>We reserve the right to refuse service for inappropriate content</li>
            </ul>
          </section>

          <section>
            <h4>9. Contact Information</h4>
            <p>For support or queries, contact us through the app or email p2dsolutions@gmail.com</p>
          </section>
        </div>

        <div className="terms-footer">
          <button className="btn-secondary" onClick={onClose}>Decline</button>
          <button className="btn-primary" onClick={onAccept}>Accept & Continue</button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
