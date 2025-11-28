import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle errors
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPayments: () => api.get('/payments'),
  updatePayment: (paymentId, data) => api.put(`/payments/${paymentId}`, data),
  getComplaints: () => api.get('/complaints'),
  updateComplaint: (complaintId, data) => api.put(`/complaints/${complaintId}`, data),
};

export const studentAPI = {
  getDashboard: (studentId) => api.get(`/student/dashboard/${studentId}`),
  getComplaints: (studentId) => api.get(`/complaints?student_id=${studentId}`),
  createComplaint: (data) => api.post('/complaints', data),
};

export const generalAPI = {
  getRooms: () => api.get('/rooms'),
  getMenu: () => api.get('/menu'),
  getWaitingList: () => api.get('/waiting-list'),
  addToWaitingList: (data) => api.post('/waiting-list', data),
};

export default api;