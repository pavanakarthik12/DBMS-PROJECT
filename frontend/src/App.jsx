import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RoomsPage from './pages/RoomsPage';
import PaymentsPage from './pages/PaymentsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import MaintenancePage from './pages/MaintenancePage';
import MenuPage from './pages/MenuPage';
import WaitingListPage from './pages/WaitingListPage';

console.log('App.jsx loaded');


const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
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

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to={user.type === 'admin' ? '/admin' : '/student'} replace /> : <LoginPage />} />

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
                    <Layout><RoomsPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/payments" element={
                <ProtectedRoute requiredRole="admin">
                    <Layout><PaymentsPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/complaints" element={
                <ProtectedRoute>
                    <Layout><ComplaintsPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/maintenance" element={
                <ProtectedRoute>
                    <Layout><MaintenancePage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/menu" element={
                <ProtectedRoute>
                    <Layout><MenuPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/waiting-list" element={
                <ProtectedRoute requiredRole="admin">
                    <Layout><WaitingListPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
