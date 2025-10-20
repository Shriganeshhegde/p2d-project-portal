import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>P2D - Project to Door</h3>
          <p className="footer-brand">by P2D Solutions</p>
          <p>Professional project printing and binding services delivered to your college.</p>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <FaPhone /> <a href="tel:+918431042937">+91 8431042937</a>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope /> <a href="mailto:support@p2d.com">support@p2d.com</a>
            </div>
            <div className="footer-contact-item">
              <FaMapMarkerAlt /> Bangalore, Karnataka
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/cancellation-refunds">Cancellation & Refunds</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Business Hours</h4>
          <p>Monday - Saturday</p>
          <p>9:00 AM - 6:00 PM</p>
          <p className="footer-note">Sunday: Closed</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} P2D Solutions - Project to Door. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
