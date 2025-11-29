import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMaintenance, createMaintenance } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const MaintenancePage = () => {
    const { user } = useAuth();
    const { triggerDashboardRefresh } = useDashboardRefresh();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        category: '',
        description: '',
        priority: 'Medium',
    });

    useEffect(() => {
        loadRequests();
        const interval = setInterval(loadRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const response = await fetchMaintenance();
            if (response.data.success) {
                setRequests(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createMaintenance({
                student_id: user.id,
                room_id: user.room_id || 1,
                category: newRequest.category,
                description: newRequest.description,
                priority: newRequest.priority,
            });
            if (response.data.success) {
                setShowModal(false);
                setNewRequest({ category: '', description: '', priority: 'Medium' });
                await loadRequests();
                triggerDashboardRefresh();
            }
        } catch (err) {
            setError('Failed to create maintenance request');
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Requests</h2>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                    >
                        New Request
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-6 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{request.category}</h3>
                                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${request.priority === 'High' ? 'bg-red-600 text-white' :
                                            request.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                                                'bg-green-600 text-white'
                                            }`}>
                                            {request.priority}
                                        </span>
                                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${request.status === 'Completed' ? 'bg-green-600 text-white' :
                                            request.status === 'In Progress' ? 'bg-blue-600 text-white' :
                                                'bg-yellow-600 text-white'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">{request.description}</p>
                                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                                        {request.room_id && (
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                Room #{request.room_id}
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">No maintenance requests found</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg max-w-md w-full p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">New Maintenance Request</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Category</label>
                                <select
                                    value={newRequest.category}
                                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Priority</label>
                                <select
                                    value={newRequest.priority}
                                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Description</label>
                                <textarea
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenancePage;
