import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaPrint, FaArrowLeft } from 'react-icons/fa';
import './OrderTracking.css';

const OrderTracking = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        // Demo order for testing
        setOrder({
          id: projectId,
          title: 'Machine Learning Project',
          status: 'printing',
          payment_status: 'paid',
          copies: 2,
          pages: 45,
          printType: 'black-white',
          paperType: 'normal-a4',
          bindingType: 'spiral',
          bindingColor: 'blue',
          college: 'RV College of Engineering',
          submittedDate: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading order:', error);
      // Demo order
      setOrder({
        id: projectId,
        title: 'Machine Learning Project',
        status: 'printing',
        payment_status: 'paid',
        copies: 2,
        pages: 45,
        college: 'RV College of Engineering',
        submittedDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderSteps = () => {
    const steps = [
      { id: 'accepted', label: 'Order Accepted', icon: <FaCheckCircle />, status: 'pending' },
      { id: 'printing', label: 'Printing in Progress', icon: <FaPrint />, status: 'pending' },
      { id: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck />, status: 'pending' },
      { id: 'delivered', label: 'Delivered', icon: <FaCheckCircle />, status: 'pending' }
    ];

    // Update steps based on order status
    if (order) {
      const statusMap = {
        'submitted': 1,
        'accepted': 1,
        'payment_confirmed': 1,
        'printing': 2,
        'out_for_delivery': 3,
        'delivered': 4
      };

      const currentStep = statusMap[order.status] || 1;

      steps.forEach((step, index) => {
        if (index < currentStep - 1) {
          step.status = 'completed';
        } else if (index === currentStep - 1) {
          step.status = 'in-progress';
        } else {
          step.status = 'pending';
        }
      });
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="tracking-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-container">
        <div className="error-state">
          <h2>Order not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = getOrderSteps();

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Track Your Order</h1>
        <p>Order ID: #{order.id}</p>
      </div>

      {/* Order Summary */}
      <div className="tracking-card">
        <h2>Order Summary</h2>
        <div className="order-summary-grid">
          <div className="summary-item">
            <span className="label">Project Title:</span>
            <span className="value">{order.title}</span>
          </div>
          <div className="summary-item">
            <span className="label">Number of Copies:</span>
            <span className="value">{order.copies || 1}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Pages:</span>
            <span className="value">{order.pages}</span>
          </div>
          <div className="summary-item">
            <span className="label">Print Type:</span>
            <span className="value">{order.printType === 'black-white' ? 'Black & White' : 'Color'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Paper Type:</span>
            <span className="value">{order.paperType === 'normal-a4' ? 'Normal A4' : 'Bond Paper'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Binding:</span>
            <span className="value">{order.bindingType} - {order.bindingColor}</span>
          </div>
          <div className="summary-item">
            <span className="label">Delivery To:</span>
            <span className="value">{order.college}</span>
          </div>
          <div className="summary-item">
            <span className="label">Payment Status:</span>
            <span className={`badge ${order.payment_status}`}>
              {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="tracking-card">
        <h2>Order Status</h2>
        <div className="timeline">
          {steps.map((step, index) => (
            <div key={step.id} className={`timeline-item ${step.status}`}>
              <div className="timeline-marker">
                <div className="timeline-icon">{step.icon}</div>
                {index < steps.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <h3>{step.label}</h3>
                {step.status === 'completed' && (
                  <p className="timeline-status">✓ Completed</p>
                )}
                {step.status === 'in-progress' && (
                  <p className="timeline-status in-progress">⏳ In Progress</p>
                )}
                {step.status === 'pending' && (
                  <p className="timeline-status pending">○ Pending</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="tracking-card delivery-card">
        <div className="delivery-info">
          <FaTruck className="delivery-icon" />
          <div>
            <h3>Estimated Delivery</h3>
            <p className="delivery-date">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="delivery-location">📍 {order.college}</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="tracking-card support-card">
        <h3>Need Help?</h3>
        <p>If you have any questions about your order, please contact our support team.</p>
        <div className="support-actions">
          <button className="btn-secondary">📞 Call Support</button>
          <button className="btn-secondary">💬 Chat with Us</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
