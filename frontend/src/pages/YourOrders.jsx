import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaTimesCircle, FaTruck, FaBox, FaPrint } from 'react-icons/fa';
import './YourOrders.css';

const YourOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/projects`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <FaCheckCircle className="status-icon success" />;
      case 'pending':
      case 'processing':
        return <FaClock className="status-icon warning" />;
      case 'printing':
        return <FaPrint className="status-icon info" />;
      case 'in-transit':
      case 'shipping':
        return <FaTruck className="status-icon info" />;
      case 'cancelled':
      case 'rejected':
        return <FaTimesCircle className="status-icon error" />;
      default:
        return <FaBox className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'printing':
      case 'in-transit':
      case 'shipping':
        return 'info';
      case 'cancelled':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="your-orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track and manage your project orders</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-icon" />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Upload your first project to get started!</p>
          <Link to="/upload" className="btn-primary">
            Upload Project
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-title">
                  <h3>{order.title}</h3>
                  <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status || 'Pending'}</span>
                </div>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Submitted:</span>
                  <span className="value">{formatDate(order.submission_date)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Department:</span>
                  <span className="value">{order.department || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span className="value">{order.description || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment:</span>
                  <span className={`badge ${order.payment_status === 'paid' ? 'success' : 'warning'}`}>
                    {order.payment_status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="order-actions">
                <Link to={`/track-order/${order.id}`} className="btn-secondary">
                  Track Order
                </Link>
                {order.payment_status === 'pending' && (
                  <Link to={`/payment/${order.id}`} className="btn-primary">
                    Complete Payment
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="back-to-dashboard">
        <Link to="/dashboard" className="btn-link">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default YourOrders;
