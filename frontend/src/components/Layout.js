import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/rooms', label: 'Room Status' },
    { path: '/payments', label: 'Payments' },
    { path: '/complaints', label: 'Complaints' },
    { path: '/menu', label: 'Food Menu' },
    { path: '/waiting-list', label: 'Waiting List' }
  ];

  const studentMenuItems = [
    { path: '/student', label: 'Dashboard' },
    { path: '/rooms', label: 'Room Status' },
    { path: '/complaints', label: 'Complaints' },
    { path: '/menu', label: 'Food Menu' }
  ];

  const menuItems = user?.type === 'admin' ? adminMenuItems : studentMenuItems;

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <button 
        className="mobile-nav-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Hostel Management</h2>
          <p>{user?.type === 'admin' ? 'Admin Panel' : `Welcome, ${user?.name}`}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </button>
          ))}
          
          <button className="nav-item" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;