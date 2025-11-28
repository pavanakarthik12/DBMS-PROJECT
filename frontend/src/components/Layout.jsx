import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminMenuItems = [
    { path: '/admin', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/rooms', label: '🏠 Room Status', icon: '🏠' },
    { path: '/payments', label: '💰 Payments', icon: '💰' },
    { path: '/complaints', label: '📝 Complaints', icon: '📝' },
    { path: '/maintenance', label: '🔧 Maintenance', icon: '🔧' },
    { path: '/menu', label: '🍽️ Food Menu', icon: '🍽️' },
    { path: '/waiting-list', label: '📋 Waiting List', icon: '📋' }
  ];

  const studentMenuItems = [
    { path: '/student', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/rooms', label: '🏠 Room Status', icon: '🏠' },
    { path: '/complaints', label: '📝 Complaints', icon: '📝' },
    { path: '/maintenance', label: '🔧 Maintenance', icon: '🔧' },
    { path: '/menu', label: '🍽️ Food Menu', icon: '🍽️' }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-600 text-white">
          <h1 className="text-lg font-bold">Hostel Management</h1>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm text-gray-600">Welcome,</p>
            <p className="font-semibold text-gray-800">
              {user?.type === 'admin' ? 'Admin' : user?.name}
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-3 ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label.split(' ').slice(1).join(' ')}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 flex items-center gap-3 mt-6"
            >
              <span className="text-lg">🚪</span>
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;