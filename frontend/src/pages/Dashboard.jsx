import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaMoneyBillWave, FaUser, FaSignOutAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import DeadlineBanner from '../components/DeadlineBanner';
import OnboardingPopup from '../components/OnboardingPopup/OnboardingPopup';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    paid: 0
  });
  const [deadlineInfo, setDeadlineInfo] = useState(null);
  const [canUpload, setCanUpload] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if this is first time user
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
        localStorage.setItem('hasSeenOnboarding', 'true');
      }
      
      // Check deadline for user's college
      if (parsedUser.college) {
        checkDeadline(parsedUser.college, parsedUser.department);
      }
    }

    // Load real projects from backend
    loadProjects();
  }, [navigate]);

  const checkDeadline = async (college, department) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(
        `${apiUrl}/api/deadlines/check/${encodeURIComponent(college)}?department=${department || ''}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeadlineInfo(data);
        setCanUpload(!data.isExpired); // Allow upload only if deadline not expired
      }
    } catch (error) {
      console.error('Error checking deadline:', error);
      setCanUpload(true); // Allow upload if deadline check fails
    }
  };

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Fetch projects from backend
      const response = await fetch(`${apiUrl}/api/projects/my-projects`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        
        // Calculate stats from real data (removed pending reviews)
        setStats({
          total: data.length,
          completed: data.filter(p => p.status === 'completed').length,
          paid: data.filter(p => p.payment_status === 'completed' || p.payment_status === 'paid').length
        });
      } else {
        // No projects yet or error
        setProjects([]);
        setStats({ total: 0, completed: 0, paid: 0 });
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Show empty state on error
      setProjects([]);
      setStats({ total: 0, completed: 0, paid: 0 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <FaCheckCircle className="status-icon success" />;
      case 'pending':
        return <FaClock className="status-icon warning" />;
      default:
        return <FaTimesCircle className="status-icon error" />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>P2D</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <FaFileAlt /> Dashboard
          </Link>
          {canUpload && (
            <Link to="/upload" className="nav-item">
              <FaUpload /> Upload Project
            </Link>
          )}
          <Link to="/payments" className="nav-item">
            <FaMoneyBillWave /> Payments
          </Link>
          <Link to="/profile" className="nav-item">
            <FaUser /> Profile
          </Link>
        </nav>

        <button onClick={handleLogout} className="sidebar-logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>P2D Dashboard</h1>
            <div className="user-info">
              <span>Welcome, {user?.name || 'Student'}</span>
            </div>
          </div>
        </header>

        {/* Deadline Banner */}
        {user?.college && deadlineInfo && deadlineInfo.hasDeadline && (
          <div className="deadline-section">
            <DeadlineBanner 
              collegeName={user.college} 
              department={user.department}
            />
            
            {/* Upload Button - Only show if deadline not expired */}
            {canUpload ? (
              <div className="upload-action-section">
                <h3>Ready to submit your project?</h3>
                <p>Upload your project before the deadline to get it printed and bound.</p>
                <Link to="/upload" className="btn-upload-large">
                  <FaUpload /> Upload Project Now
                </Link>
              </div>
            ) : (
              <div className="deadline-expired-notice">
                <FaTimesCircle />
                <h3>Submission Closed</h3>
                <p>The deadline for project submission has passed. Uploads are no longer accepted.</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <FaFileAlt />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon paid">
              <FaMoneyBillWave />
            </div>
            <div className="stat-info">
              <h3>{stats.paid}</h3>
              <p>Paid</p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="projects-section">
          <h2>Recent Projects</h2>
          
          {projects.length === 0 ? (
            <div className="empty-state">
              <FaFileAlt />
              <h3>No projects yet</h3>
              <p>Your submitted projects will appear here</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    {getStatusIcon(project.status)}
                  </div>
                  <div className="project-details">
                    <div className="detail-item">
                      <span className="label">Submitted:</span>
                      <span className="value">{project.submission_date ? new Date(project.submission_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Department:</span>
                      <span className="value">{project.department || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className={`badge ${project.status}`}>{project.status}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Payment:</span>
                      <span className={`badge ${project.payment_status}`}>{project.payment_status}</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <Link to={`/track-order/${project.id}`} className="btn-secondary">Track Order</Link>
                    {project.payment_status === 'pending' && (
                      <Link to={`/payment/${project.id}`} className="btn-primary">Pay Now</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <OnboardingPopup
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export default Dashboard;
