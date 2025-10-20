import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PolicyPages.css';

const CancellationRefunds = () => {
  return (
    <div className="policy-container">
      <Link to="/login" className="back-link">
        <FaArrowLeft /> Back
      </Link>

      <div className="policy-content">
        <h1>Cancellation & Refunds Policy</h1>
        <p className="last-updated">Last Updated: October 20, 2025</p>

        <section>
          <h2>1. Order Cancellation</h2>
          <h3>1.1 Before Printing Begins</h3>
          <ul>
            <li>You can cancel your order anytime before printing starts</li>
            <li>Full refund will be processed (100% of order value)</li>
            <li>To cancel, contact us at +91 8431042937 or through your dashboard</li>
            <li>Cancellation must be requested within 2 hours of order placement</li>
          </ul>

          <h3>1.2 After Printing Begins</h3>
          <ul>
            <li>Once printing has started, orders cannot be cancelled</li>
            <li>You will be notified when printing begins</li>
            <li>Check your order status in the dashboard before requesting cancellation</li>
          </ul>

          <h3>1.3 How to Cancel</h3>
          <ol>
            <li>Log in to your P2D dashboard</li>
            <li>Go to "Your Orders" section</li>
            <li>Select the order you want to cancel</li>
            <li>Click "Request Cancellation" (if available)</li>
            <li>Or call us at +91 8431042937 with your order ID</li>
          </ol>
        </section>

        <section>
          <h2>2. Refund Policy</h2>
          <h3>2.1 Eligible for Refund</h3>
          <p>You are eligible for a full refund in the following cases:</p>
          <ul>
            <li>Order cancelled before printing begins</li>
            <li>Defective or damaged product received</li>
            <li>Wrong product delivered</li>
            <li>Product not delivered within promised timeline (without valid reason)</li>
            <li>Quality issues with printing or binding</li>
          </ul>

          <h3>2.2 Not Eligible for Refund</h3>
          <ul>
            <li>Order cancelled after printing has begun</li>
            <li>Customer provided wrong specifications</li>
            <li>Customer uploaded incorrect files</li>
            <li>Delivery failed due to incorrect address provided by customer</li>
            <li>Customer unavailable to receive delivery (after 2 attempts)</li>
          </ul>
        </section>

        <section>
          <h2>3. Refund Process</h2>
          <h3>3.1 Timeline</h3>
          <ul>
            <li>Refund requests are processed within 24-48 hours</li>
            <li>Approved refunds are initiated within 2 business days</li>
            <li>Refund amount will be credited to your original payment method</li>
            <li>Bank processing time: 5-7 business days</li>
            <li>Total refund timeline: 7-10 business days from approval</li>
          </ul>

          <h3>3.2 Refund Amount</h3>
          <ul>
            <li><strong>Before Printing:</strong> 100% refund</li>
            <li><strong>Defective Product:</strong> 100% refund or free replacement</li>
            <li><strong>Partial Delivery:</strong> Refund for undelivered items</li>
          </ul>

          <h3>3.3 How to Request Refund</h3>
          <ol>
            <li>Contact us within 24 hours of delivery (for defective products)</li>
            <li>Provide your order ID and reason for refund</li>
            <li>Share photos/videos of the issue (if applicable)</li>
            <li>Our team will review and respond within 24 hours</li>
            <li>Once approved, refund will be processed</li>
          </ol>
        </section>

        <section>
          <h2>4. Replacement Policy</h2>
          <p>Instead of a refund, you may opt for a free replacement in case of:</p>
          <ul>
            <li>Defective printing quality</li>
            <li>Binding issues</li>
            <li>Damaged product during delivery</li>
            <li>Wrong specifications (our error)</li>
          </ul>
          <p><strong>Replacement Timeline:</strong> 2-3 working days from approval</p>
        </section>

        <section>
          <h2>5. Defective Product Claims</h2>
          <h3>5.1 Reporting Timeline</h3>
          <ul>
            <li>Report defects within 24 hours of delivery</li>
            <li>Late reports may not be eligible for refund/replacement</li>
          </ul>

          <h3>5.2 What Qualifies as Defective</h3>
          <ul>
            <li>Poor print quality (blurred, faded, smudged)</li>
            <li>Binding issues (loose pages, broken spine)</li>
            <li>Missing pages</li>
            <li>Wrong binding type or color</li>
            <li>Physical damage to the product</li>
          </ul>

          <h3>5.3 Proof Required</h3>
          <ul>
            <li>Clear photos of the defect</li>
            <li>Video showing the issue (if applicable)</li>
            <li>Order ID and delivery receipt</li>
          </ul>
        </section>

        <section>
          <h2>6. Partial Refunds</h2>
          <p>Partial refunds may be issued in cases where:</p>
          <ul>
            <li>Only some copies in a multi-copy order are defective</li>
            <li>Minor quality issues that don't affect usability</li>
            <li>Delivery delays (compensation)</li>
          </ul>
        </section>

        <section>
          <h2>7. Refund Status Tracking</h2>
          <p>You can track your refund status by:</p>
          <ul>
            <li>Checking your P2D dashboard</li>
            <li>Contacting us at +91 8431042937</li>
            <li>Email: refunds@p2d.com</li>
          </ul>
        </section>

        <section>
          <h2>8. Payment Gateway Charges</h2>
          <p>
            Payment gateway charges (if any) are non-refundable. The refund amount will be the order value minus any transaction fees charged by the payment gateway.
          </p>
        </section>

        <section>
          <h2>9. Dispute Resolution</h2>
          <p>
            If you're not satisfied with our refund decision:
          </p>
          <ul>
            <li>Contact our support team at +91 8431042937</li>
            <li>Escalate to our management team</li>
            <li>We will review your case within 48 hours</li>
            <li>Our decision will be final and binding</li>
          </ul>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            For cancellation and refund queries:
          </p>
          <ul>
            <li>Phone: +91 8431042937</li>
            <li>Email: refunds@p2d.com</li>
            <li>Available: Mon-Sat, 9 AM - 6 PM</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CancellationRefunds;
