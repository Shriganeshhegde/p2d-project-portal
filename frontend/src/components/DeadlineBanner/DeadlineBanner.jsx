import React, { useState, useEffect } from 'react';
import { FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './DeadlineBanner.css';

const DeadlineBanner = ({ collegeName, department }) => {
  const [deadlineInfo, setDeadlineInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (collegeName) {
      fetchDeadline();
    }
  }, [collegeName, department]);

  const fetchDeadline = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(
        `${apiUrl}/api/deadlines/check/${encodeURIComponent(collegeName)}?department=${department || ''}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeadlineInfo(data);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !deadlineInfo || !deadlineInfo.hasDeadline) {
    return null;
  }

  const getUrgencyClass = () => {
    if (deadlineInfo.isExpired) return 'expired';
    if (deadlineInfo.daysRemaining <= 3) return 'critical';
    if (deadlineInfo.daysRemaining <= 7) return 'warning';
    return 'normal';
  };

  const getIcon = () => {
    if (deadlineInfo.isExpired) return <FaExclamationTriangle />;
    if (deadlineInfo.daysRemaining <= 3) return <FaExclamationTriangle />;
    return <FaClock />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`deadline-banner ${getUrgencyClass()}`}>
      <div className="deadline-icon">
        {getIcon()}
      </div>
      
      <div className="deadline-content">
        <div className="deadline-header">
          <h3>
            {deadlineInfo.isExpired ? '⛔ Submission Deadline Passed' : '📅 Project Submission Deadline'}
          </h3>
          <span className="deadline-college">{collegeName}</span>
        </div>
        
        <div className="deadline-details">
          <div className="deadline-date">
            <strong>Deadline:</strong> {formatDate(deadlineInfo.deadline)}
          </div>
          
          {!deadlineInfo.isExpired && (
            <div className="deadline-countdown">
              <span className="days-number">{deadlineInfo.daysRemaining}</span>
              <span className="days-label">day{deadlineInfo.daysRemaining !== 1 ? 's' : ''} remaining</span>
            </div>
          )}
          
          {deadlineInfo.isExpired && (
            <div className="deadline-expired-message">
              <FaExclamationTriangle />
              <span>Uploads are no longer accepted for this college</span>
            </div>
          )}
        </div>
        
        {deadlineInfo.notes && (
          <div className="deadline-notes">
            <em>{deadlineInfo.notes}</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineBanner;
