import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PolicyPages.css';

const ShippingPolicy = () => {
  return (
    <div className="policy-container">
      <Link to="/login" className="back-link">
        <FaArrowLeft /> Back
      </Link>

      <div className="policy-content">
        <h1>Shipping & Delivery Policy</h1>
        <p className="last-updated">Last Updated: October 20, 2025</p>

        <section>
          <h2>1. Delivery Coverage</h2>
          <p>
            P2D currently delivers to colleges and educational institutions in Bangalore. We are continuously expanding our delivery network to serve more locations.
          </p>
        </section>

        <section>
          <h2>2. Delivery Timeline</h2>
          <ul>
            <li><strong>Standard Delivery:</strong> 3 working days from order confirmation</li>
            <li>Orders placed before 5:00 PM are processed the same day</li>
            <li>Orders placed after 5:00 PM are processed from the next working day</li>
            <li>Delivery timeline excludes weekends (Saturday & Sunday)</li>
            <li>Public holidays may extend delivery time by 1-2 days</li>
          </ul>
        </section>

        <section>
          <h2>3. Delivery Process</h2>
          <h3>Step 1: Order Confirmation</h3>
          <p>You will receive an email/SMS confirmation once your order is placed and payment is successful.</p>
          
          <h3>Step 2: Printing & Binding</h3>
          <p>Your project will be printed and bound according to your specifications. You can track this status in your dashboard.</p>
          
          <h3>Step 3: Quality Check</h3>
          <p>We perform a quality check to ensure your project meets our standards before dispatch.</p>
          
          <h3>Step 4: Dispatch</h3>
          <p>Your order is dispatched to your college address. You will receive a notification with tracking details.</p>
          
          <h3>Step 5: Delivery</h3>
          <p>Our delivery partner will deliver your project to your specified college address.</p>
        </section>

        <section>
          <h2>4. Delivery Address</h2>
          <ul>
            <li>Delivery is made to your college campus only</li>
            <li>Please provide accurate college name and department</li>
            <li>Ensure someone is available to receive the delivery</li>
            <li>We will contact you via phone if there are any delivery issues</li>
          </ul>
        </section>

        <section>
          <h2>5. Order Tracking</h2>
          <p>
            You can track your order status in real-time through your P2D dashboard. Order statuses include:
          </p>
          <ul>
            <li><strong>Order Accepted:</strong> Payment confirmed, order in queue</li>
            <li><strong>Printing:</strong> Your project is being printed</li>
            <li><strong>Out for Delivery:</strong> Order dispatched to your college</li>
            <li><strong>Delivered:</strong> Order successfully delivered</li>
          </ul>
        </section>

        <section>
          <h2>6. Delivery Charges</h2>
          <p>
            Delivery charges are included in the total order price. There are no hidden delivery fees.
          </p>
        </section>

        <section>
          <h2>7. Failed Delivery</h2>
          <p>
            In case of failed delivery due to incorrect address or unavailability:
          </p>
          <ul>
            <li>We will attempt delivery up to 2 times</li>
            <li>You will be contacted via phone for redelivery arrangements</li>
            <li>Additional delivery charges may apply for redelivery attempts</li>
          </ul>
        </section>

        <section>
          <h2>8. Delivery Issues</h2>
          <p>
            If you face any delivery issues:
          </p>
          <ul>
            <li>Contact us immediately at +91 8431042937</li>
            <li>Provide your order ID for quick resolution</li>
            <li>We will investigate and resolve the issue within 24 hours</li>
          </ul>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            For delivery-related queries:
          </p>
          <ul>
            <li>Phone: +91 8431042937</li>
            <li>Email: delivery@p2d.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
