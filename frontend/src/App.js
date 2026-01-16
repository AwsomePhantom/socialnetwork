import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/pages/Feed';
import Messenger from './components/pages/Messenger';
import Clubs from './components/pages/Clubs';
import Library from './components/pages/Library';
import CGPA from './components/pages/CGPA';
import Profile from './components/pages/Profile';
import AdminDashboard from './components/pages/AdminDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/feed" replace />;
  }
  
  return children;
};

// Layout with Navigation
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  
  return (
    <div className="app-container">
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <span className="logo-text">StudentHub</span>
          </div>
          <div className="header-actions">
            {user?.role === 'club_admin' && (
              <span className="role-badge admin">Club Admin</span>
            )}
            {user?.role === 'admin' && (
              <a href="/admin" className="role-badge system-admin" style={{textDecoration: 'none'}}>
                <i className="fas fa-shield-alt"></i> Admin
              </a>
            )}
            <div className="user-avatar" onClick={() => window.location.href = '/profile'}>
              <img 
                src={user?.avatar || user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`} 
                alt="Avatar" 
              />
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-container">
          <NavItem to="/feed" icon="fa-home" label="Feed" />
          <NavItem to="/messenger" icon="fa-comments" label="Chat" />
          <NavItem to="/clubs" icon="fa-users" label="Clubs" />
          <NavItem to="/library" icon="fa-book" label="Library" />
          <NavItem to="/cgpa" icon="fa-calculator" label="CGPA" />
          <NavItem to="/profile" icon="fa-user" label="Profile" />
        </div>
      </nav>
    </div>
  );
};

// Admin Layout (no bottom nav)
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  
  return (
    <div className="app-container admin-layout">
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1" style={{background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)'}}></div>
        <div className="bg-orb bg-orb-2" style={{background: 'radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%)'}}></div>
        <div className="bg-orb bg-orb-3" style={{background: 'radial-gradient(circle, rgba(185, 28, 28, 0.25) 0%, transparent 70%)'}}></div>
      </div>
      
      {/* Header */}
      <header className="app-header admin-header-bar">
        <div className="header-content">
          <div className="logo">
            <a href="/feed" className="back-to-app">
              <i className="fas fa-arrow-left"></i>
            </a>
            <div className="logo-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <span className="logo-text">Admin Panel</span>
          </div>
          <div className="header-actions">
            <span className="role-badge system-admin">System Admin</span>
            <div className="user-avatar">
              <img 
                src={user?.avatar || user?.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName}`} 
                alt="Avatar" 
              />
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="app-main admin-main">
        {children}
      </main>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ to, icon, label }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <a href={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
    </a>
  );
};

function App() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/feed" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/feed" replace /> : <Register />} 
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <AppLayout><Feed /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/messenger" element={
          <ProtectedRoute>
            <AppLayout><Messenger /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/clubs" element={
          <ProtectedRoute>
            <AppLayout><Clubs /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <AppLayout><Library /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/cgpa" element={
          <ProtectedRoute>
            <AppLayout><CGPA /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </div>
  );
}

export default App;
