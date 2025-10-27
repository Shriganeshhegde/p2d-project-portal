import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PolicyPages.css';

const TermsConditions = () => {
  return (
    <div className="policy-container">
      <Link to="/login" className="back-link">
        <FaArrowLeft /> Back
      </Link>

      <div className="policy-content">
        <h1>Terms and Conditions</h1>
        <p className="last-updated">Last Updated: October 20, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using P2D (Project to Door) services by P2D Solutions, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2>2. Service Description</h2>
          <p>
            P2D Solutions provides project printing, binding, and delivery services to students. Our services include:
          </p>
          <ul>
            <li>Document printing (black & white and color)</li>
            <li>Professional binding services (spiral, hardcover, softcover)</li>
            <li>Delivery to your college campus</li>
            <li>Order tracking and status updates</li>
          </ul>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>As a user of P2D services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information during registration</li>
            <li>Upload only documents you have the right to print</li>
            <li>Ensure uploaded files are in acceptable formats (PDF, DOC, DOCX)</li>
            <li>Verify all customization options before payment</li>
            <li>Make timely payments through our secure payment gateway</li>
            <li>Not upload any offensive, illegal, or copyrighted content without permission</li>
          </ul>
        </section>

        <section>
          <h2>4. Pricing and Payment</h2>
          <ul>
            <li>All prices are displayed in Indian Rupees (INR)</li>
            <li>Prices are calculated based on pages, copies, print type, and binding options</li>
            <li>Payment must be completed before printing begins</li>
            <li>We accept payments through Razorpay (UPI, Cards, Net Banking)</li>
            <li>All prices include applicable taxes</li>
          </ul>
        </section>

        <section>
          <h2>5. Order Processing and Delivery</h2>
          <ul>
            <li>Orders are processed within 3 working days from payment confirmation</li>
            <li>Orders placed after 5:00 PM will be processed from the next working day</li>
            <li>Delivery is made to your specified college address</li>
            <li>You will receive notifications about order status updates</li>
            <li>Delivery timelines exclude weekends and public holidays</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Privacy and Security</h2>
          <ul>
            <li>Your personal information is stored securely and never shared with third parties</li>
            <li>Uploaded project files are automatically deleted 7 days after delivery</li>
            <li>Payment information is processed securely through Razorpay</li>
            <li>We use industry-standard encryption to protect your data</li>
          </ul>
        </section>

        <section>
          <h2>7. Quality Assurance</h2>
          <ul>
            <li>We guarantee high-quality printing and professional binding</li>
            <li>If you receive a defective product, contact us within 24 hours of delivery</li>
            <li>We will provide replacements for manufacturing defects at no additional cost</li>
          </ul>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            You retain all rights to your uploaded documents. By using our service, you grant P2D a limited license to print and deliver your documents as per your order specifications.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            P2D Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of modified terms.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            For questions about these terms, please contact us:
          </p>
          <ul>
            <li>Phone: +91 8431042937</li>
            <li>Email: p2dsolutions@gmail.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
