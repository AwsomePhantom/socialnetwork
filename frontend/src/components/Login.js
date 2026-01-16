import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon-large">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h1 className="auth-title">StudentHub</h1>
            <p className="auth-subtitle">Welcome back! Please login</p>
          </div>
          
          {/* Error Message */}
          {(formError || error) && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {formError || error}
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </>
              )}
            </button>
          </form>
          
          {/* Register Link */}
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="auth-link">
              Create Student Account
            </Link>
          </div>
          
          {/* Demo Accounts */}
          <div className="demo-accounts">
            <p className="demo-title">Demo Accounts (password: password)</p>
            <div className="demo-grid">
              <div className="demo-item admin">
                <p className="demo-role">Admin</p>
                <p className="demo-email">admin@university.edu</p>
              </div>
              <div className="demo-item student">
                <p className="demo-role">Student</p>
                <p className="demo-email">john@university.edu</p>
              </div>
              <div className="demo-item club-admin">
                <p className="demo-role">Club Admin</p>
                <p className="demo-email">mike@university.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
