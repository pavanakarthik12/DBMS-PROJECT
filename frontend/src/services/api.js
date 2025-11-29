import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const login = (email, password, userType) => {
    return api.post('/login', { email, password, userType });
};

export const fetchAdminDashboard = () => {
    return api.get('/admin/dashboard');
};

export const fetchStudentDashboard = (studentId) => {
    return api.get(`/student/dashboard/${studentId}`);
};

export const fetchRooms = () => {
    return api.get('/rooms');
};

export const fetchPayments = () => {
    return api.get('/payments');
};

export const updatePayment = (paymentId, status) => {
    return api.put(`/payments/${paymentId}`, { status });
};

export const fetchComplaints = (studentId = null) => {
    const url = studentId ? `/complaints?student_id=${studentId}` : '/complaints';
    return api.get(url);
};

export const createComplaint = (data) => {
    return api.post('/complaints', data);
};

export const updateComplaint = (complaintId, status) => {
    return api.put(`/complaints/${complaintId}`, { status });
};

export const fetchMenu = () => {
    return api.get('/menu');
};

export const fetchWaitingList = () => {
    return api.get('/waiting-list');
};

export const fetchMaintenance = () => {
    return api.get('/maintenance');
};

export const createMaintenance = (data) => {
    return api.post('/maintenance', data);
};

export const fetchRoomChangeRequests = () => {
    return api.get('/room-change-requests');
};

export const createRoomChangeRequest = (data) => {
    return api.post('/room-change-requests', data);
};

export const approveRoomChangeRequest = (requestId) => {
    return api.put(`/room-change-requests/${requestId}/approve`);
};

export const denyRoomChangeRequest = (requestId) => {
    return api.put(`/room-change-requests/${requestId}/deny`);
};

export default api;
