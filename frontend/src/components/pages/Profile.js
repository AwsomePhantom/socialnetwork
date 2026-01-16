import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, getImageUrl } from '../../services/api';
import '../../styles/components.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    major: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        studentId: user.studentId || '',
        major: user.major || user.profile?.major || '',
        bio: user.bio || user.profile?.bio || '',
      });
      
      // Set initial avatar
      const currentAvatar = user.avatar || user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`;
      setAvatarPreview(getImageUrl(currentAvatar));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: '', text: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setAvatarPreview(base64);
        setAvatarBase64(base64);
        setMessage({ type: '', text: '' });
      };
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read image file' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // Prepare update data
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        major: formData.major,
        bio: formData.bio,
      };

      // Include avatar only if a new one was selected
      if (avatarBase64) {
        updateData.avatar = avatarBase64;
      }

      console.log('Saving profile with avatar:', !!avatarBase64);
      
      const result = await usersAPI.update(user.id, updateData);
      
      console.log('Save result:', result);
      
      if (result.success) {
        // Update local user context
        updateUser({
          fullName: formData.fullName,
          email: formData.email,
          major: formData.major,
          bio: formData.bio,
          avatar: result.user?.avatar || avatarPreview,
          profile: {
            ...user.profile,
            major: formData.major,
            bio: formData.bio,
            avatar: result.user?.avatar || avatarPreview,
          },
        });
        
        // Clear the base64 since it's now saved
        setAvatarBase64(null);
        
        // Update preview with saved URL
        if (result.user?.avatar) {
          setAvatarPreview(getImageUrl(result.user.avatar));
        }
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return <span className="role-badge system-admin">System Admin</span>;
      case 'club_admin':
        return <span className="role-badge admin">Club Admin</span>;
      default:
        return <span className="role-badge student">Student</span>;
    }
  };

  const getDisplayAvatar = () => {
    return avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'user'}`;
  };

  return (
    <div className="profile-page">
      <h2 className="page-title">
        <i className="fas fa-user-circle"></i>
        My Profile
      </h2>

      <div className="card profile-card">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <div className="avatar-ring-large">
              <img
                src={getDisplayAvatar()}
                alt="Avatar"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'user'}`;
                }}
              />
            </div>
            <label className="avatar-upload-btn">
              <i className="fas fa-camera"></i>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                hidden
              />
            </label>
          </div>
          <h3>{formData.fullName || user?.fullName}</h3>
          {getRoleBadge()}
          {avatarBase64 && (
            <p className="avatar-changed-notice">
              <i className="fas fa-info-circle"></i> New avatar selected. Click "Save Changes" to apply.
            </p>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                className="form-input"
                disabled
              />
            </div>
            <div className="form-group">
              <label>Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="form-input"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={saving}
          >
            {saving ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Account Info */}
        <div className="account-info">
          <h4>Account Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <i className="fas fa-calendar"></i>
              <div>
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <span className="info-label">Role</span>
                <span className="info-value">
                  {user?.role === 'admin' ? 'System Admin' : 
                   user?.role === 'club_admin' ? 'Club Admin' : 'Student'}
                </span>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-circle" style={{ color: user?.isOnline ? '#22c55e' : '#6b7280' }}></i>
              <div>
                <span className="info-label">Status</span>
                <span className="info-value">{user?.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
