import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RoomStatus from './pages/RoomStatus';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import Maintenance from './pages/Maintenance';
import Menu from './pages/Menu';
import WaitingList from './pages/WaitingList';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.type !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.type === 'admin' ? '/admin' : '/student'} replace /> : <Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/student" element={
          <ProtectedRoute requiredRole="student">
            <Layout><StudentDashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/rooms" element={
          <ProtectedRoute>
            <Layout><RoomStatus /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/payments" element={
          <ProtectedRoute requiredRole="admin">
            <Layout><Payments /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/complaints" element={
          <ProtectedRoute>
            <Layout><Complaints /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/maintenance" element={
          <ProtectedRoute>
            <Layout><Maintenance /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/menu" element={
          <ProtectedRoute>
            <Layout><Menu /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/waiting-list" element={
          <ProtectedRoute requiredRole="admin">
            <Layout><WaitingList /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;