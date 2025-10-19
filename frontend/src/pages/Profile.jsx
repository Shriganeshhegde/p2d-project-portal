import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaUniversity, FaGraduationCap, FaBook, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    studentId: '',
    college: '',
    department: '',
    semester: '',
    contactNumber: '',
    address: '',
    dateOfBirth: '',
    guardianName: '',
    guardianContact: ''
  });

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      studentId: user.studentId || '',
      college: user.college || '',
      department: user.department || '',
      semester: user.semester || '',
      contactNumber: user.contactNumber || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
      guardianName: user.guardianName || '',
      guardianContact: user.guardianContact || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload original data
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        studentId: user.studentId || '',
        college: user.college || '',
        department: user.department || '',
        semester: user.semester || '',
        contactNumber: user.contactNumber || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        guardianName: user.guardianName || '',
        guardianContact: user.guardianContact || ''
      });
    }
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <div className="profile-title">
          <h1>{profileData.name || 'Student Profile'}</h1>
          <p>{profileData.studentId}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="btn-save" disabled={loading}>
                <FaSave /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {/* Personal Information */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label><FaUser /> Full Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>

            <div className="profile-field">
              <label><FaEnvelope /> Email Address</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>

            <div className="profile-field">
              <label><FaIdCard /> Student ID</label>
              <input
                type="text"
                name="studentId"
                value={profileData.studentId}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter student ID"
              />
            </div>

            <div className="profile-field">
              <label><FaPhone /> Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter contact number"
              />
            </div>

            <div className="profile-field">
              <label>📅 Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field full-width">
              <label><FaMapMarkerAlt /> Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your address"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="profile-section">
          <h2>Academic Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label><FaUniversity /> College/University</label>
              <input
                type="text"
                name="college"
                value={profileData.college}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter college name"
              />
            </div>

            <div className="profile-field">
              <label><FaGraduationCap /> Department</label>
              <input
                type="text"
                name="department"
                value={profileData.department}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="profile-field">
              <label><FaBook /> Current Semester</label>
              <select
                name="semester"
                value={profileData.semester}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="profile-section">
          <h2>Guardian Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label><FaUser /> Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                value={profileData.guardianName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter guardian name"
              />
            </div>

            <div className="profile-field">
              <label><FaPhone /> Guardian Contact</label>
              <input
                type="tel"
                name="guardianContact"
                value={profileData.guardianContact}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter guardian contact"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
