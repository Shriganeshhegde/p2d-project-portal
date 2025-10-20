import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <Link to="/login" className="back-link">
        <FaArrowLeft /> Back
      </Link>

      <div className="policy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: October 20, 2025</p>

        <section>
          <h2>1. Information We Collect</h2>
          <h3>Personal Information:</h3>
          <ul>
            <li>Name and student ID</li>
            <li>Email address and phone number</li>
            <li>College name and department</li>
            <li>Delivery address</li>
          </ul>
          <h3>Project Information:</h3>
          <ul>
            <li>Uploaded document files</li>
            <li>Project customization preferences</li>
            <li>Order history and tracking information</li>
          </ul>
          <h3>Payment Information:</h3>
          <ul>
            <li>Payment transaction details (processed securely through Razorpay)</li>
            <li>We do not store credit card or banking information</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process and fulfill your printing orders</li>
            <li>Communicate order status and delivery updates</li>
            <li>Provide customer support</li>
            <li>Improve our services and user experience</li>
            <li>Send important service notifications</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Storage and Security</h2>
          <ul>
            <li>All data is stored on secure servers with encryption</li>
            <li>Uploaded project files are automatically deleted 7 days after delivery</li>
            <li>Personal information is retained as long as your account is active</li>
            <li>We use industry-standard security measures to protect your data</li>
            <li>Access to your data is restricted to authorized personnel only</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following cases:</p>
          <ul>
            <li>With delivery partners to fulfill your orders</li>
            <li>With payment processors (Razorpay) for transaction processing</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze site usage. You can control cookie settings through your browser.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Update or correct your information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        <section>
          <h2>7. Children's Privacy</h2>
          <p>
            Our services are intended for students aged 18 and above. We do not knowingly collect information from minors without parental consent.
          </p>
        </section>

        <section>
          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our website and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or how we handle your data, please contact us:
          </p>
          <ul>
            <li>Phone: +91 8431042937</li>
            <li>Email: privacy@p2d.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
