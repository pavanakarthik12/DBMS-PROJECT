import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardRefreshProvider } from './context/DashboardRefreshContext';
import Layout from './components/Layout';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import RoomsPage from './pages/RoomsPage';
import PaymentsPage from './pages/PaymentsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import MaintenancePage from './pages/MaintenancePage';
import MenuPage from './pages/MenuPage';
import WaitingListPage from './pages/WaitingListPage';
import AnnouncementsPage from './pages/AnnouncementsPage';

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <RoleProtectedRoute requiredRole="admin">
                    <Layout><AdminDashboard /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/rooms" element={
                <RoleProtectedRoute requiredRole="admin">
                    <Layout><RoomsPage /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/payments" element={
                <RoleProtectedRoute requiredRole="admin">
                    <Layout><PaymentsPage /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/waiting-list" element={
                <RoleProtectedRoute requiredRole="admin">
                    <Layout><WaitingListPage /></Layout>
                </RoleProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student" element={
                <RoleProtectedRoute requiredRole="student">
                    <Layout><StudentDashboard /></Layout>
                </RoleProtectedRoute>
            } />

            {/* Shared Routes (Accessible by both but wrapped in protection) */}
            <Route path="/complaints" element={
                <RoleProtectedRoute>
                    <Layout><ComplaintsPage /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/maintenance" element={
                <RoleProtectedRoute>
                    <Layout><MaintenancePage /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/menu" element={
                <RoleProtectedRoute>
                    <Layout><MenuPage /></Layout>
                </RoleProtectedRoute>
            } />
            <Route path="/announcements" element={
                <RoleProtectedRoute>
                    <Layout><AnnouncementsPage /></Layout>
                </RoleProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <DashboardRefreshProvider>
                    <AppRoutes />
                </DashboardRefreshProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
