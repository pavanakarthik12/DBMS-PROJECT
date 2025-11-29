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
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Maintenance Requests</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{requests.length} total requests</p>
                </div>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        New Request
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{request.category}</h3>
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${request.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                            request.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            }`}>
                                            {request.priority}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${request.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                            request.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">{request.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        {request.room_id && <span>Room #{request.room_id}</span>}
                                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No maintenance requests found</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">New Maintenance Request</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={newRequest.category}
                                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                                <select
                                    value={newRequest.priority}
                                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
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
