import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (credentials) => api.post('/login', credentials);
export const fetchDashboardStats = () => api.get('/admin/dashboard');
export const fetchStudentDashboard = (id) => api.get(`/student/dashboard/${id}`);
export const fetchRooms = () => api.get('/rooms');
export const fetchAvailableRooms = () => api.get('/available-rooms');
export const fetchPayments = () => api.get('/payments');
export const fetchComplaints = () => api.get('/complaints');
export const createComplaint = (data) => api.post('/complaints', data);
export const resolveComplaint = (id) => api.put(`/complaints/${id}/resolve`);
export const fetchMaintenanceRequests = () => api.get('/maintenance');
export const createMaintenanceRequest = (data) => api.post('/maintenance', data);
export const resolveMaintenanceRequest = (id) => api.put(`/maintenance/${id}/resolve`);
export const fetchMenu = () => api.get('/menu');
export const fetchWaitingList = () => api.get('/waiting-list');
export const fetchRoomChangeRequests = () => api.get('/room-change-requests');
export const createRoomChangeRequest = (data) => api.post('/room-change-requests', data);
export const approveRoomChangeRequest = (id) => api.put(`/room-change-requests/${id}/approve`);
export const denyRoomChangeRequest = (id) => api.put(`/room-change-requests/${id}/deny`);
export const fetchAnnouncements = () => api.get('/announcements');

export default api;
