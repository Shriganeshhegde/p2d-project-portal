import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnimatedLogo from '../components/AnimatedLogo';
import { bangaloreColleges } from '../data/bangaloreColleges';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    college: '',
    customCollege: '',
    department: '',
    semester: ''
  });
  const [showCustomCollege, setShowCustomCollege] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword, studentId, college, customCollege, department, semester } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'college') {
      if (value === 'Others (Type your college name)') {
        setShowCustomCollege(true);
        setFormData({ ...formData, college: value, customCollege: '' });
      } else {
        setShowCustomCollege(false);
        setFormData({ ...formData, college: value, customCollege: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      console.log('Attempting registration to:', `${apiUrl}/api/auth/register`);
      
      const finalCollege = showCustomCollege ? customCollege : college;
      
      const res = await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        email,
        password,
        studentId,
        college: finalCollege,
        department,
        semester: parseInt(semester)
      });
      
      // Store token and user data
      localStorage.setItem('token', res.data.token);
      
      // Store user data if available
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        // Create user object from form data
        localStorage.setItem('user', JSON.stringify({
          name,
          email,
          studentId,
          college,
          department,
          semester
        }));
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Detailed error message
      let errorMessage = 'Registration failed. ';
      
      if (err.response) {
        // Server responded with error
        errorMessage += err.response.data?.message || err.response.data?.error || 'Server error';
        console.error('Server error:', err.response.data);
      } else if (err.request) {
        // Request made but no response
        errorMessage += 'Cannot connect to server. Make sure backend is running on port 5000.';
        console.error('No response from server');
      } else {
        // Something else happened
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <AnimatedLogo size="medium" showText={false} />
      
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h1>P2D</h1>
          <h2>Create Your Account</h2>
          <p>Join us to submit and track your projects</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </div>

          <div className="form-group">
            <label htmlFor="studentId">Student ID *</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={onChange}
              placeholder="Enter student ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create password"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm password"
                required
                minLength="6"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="college">College/University *</label>
            <select
              id="college"
              name="college"
              value={college}
              onChange={onChange}
              required
            >
              <option value="">Select your college</option>
              {bangaloreColleges.map((collegeName, index) => (
                <option key={index} value={collegeName}>{collegeName}</option>
              ))}
            </select>
          </div>

          {showCustomCollege && (
            <div className="form-group">
              <label htmlFor="customCollege">Enter College Name *</label>
              <input
                type="text"
                id="customCollege"
                name="customCollege"
                value={customCollege}
                onChange={onChange}
                placeholder="Type your college name"
                required
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={department}
                onChange={onChange}
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <select
                id="semester"
                name="semester"
                value={semester}
                onChange={onChange}
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
