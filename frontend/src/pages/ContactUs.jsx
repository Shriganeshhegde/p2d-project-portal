import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './PolicyPages.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="policy-container">
      <Link to="/login" className="back-link">
        <FaArrowLeft /> Back
      </Link>

      <div className="policy-content">
        <h1>Contact Us</h1>
        <p className="subtitle">P2D Solutions - Project to Door</p>
        <p className="subtitle">We're here to help! Reach out to us for any queries or support.</p>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-item">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p><a href="tel:+918431042937">+91 8431042937</a></p>
                <p className="contact-note">Available Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p><a href="mailto:support@p2d.com">support@p2d.com</a></p>
                <p className="contact-note">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-details">
                <h3>Location</h3>
                <p>Bangalore, Karnataka</p>
                <p className="contact-note">Serving colleges across Bangalore</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaClock />
              </div>
              <div className="contact-details">
                <h3>Business Hours</h3>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="contact-note">Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            {submitted && (
              <div className="success-message">
                Thank you! We've received your message and will get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How long does delivery take?</h3>
            <p>Standard delivery takes 3 working days from order confirmation. Orders placed after 5 PM are processed from the next working day.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major payment methods through Razorpay including UPI, Credit/Debit Cards, and Net Banking.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel my order?</h3>
            <p>Yes, you can cancel your order before printing begins. Refunds are processed within 5-7 business days.</p>
          </div>
          <div className="faq-item">
            <h3>Do you deliver to all colleges in Bangalore?</h3>
            <p>Yes, we deliver to all major colleges and educational institutions across Bangalore.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
