import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMaintenance, createMaintenance } from '../services/api';

const MaintenancePage = () => {
    const { user } = useAuth();
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
            }
        } catch (err) {
            setError('Failed to create maintenance request');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Requests</h2>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        New Request
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {requests.map((request) => (
                    <div key={request.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.category}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.priority === 'High' ? 'bg-red-600 text-white' :
                                            request.priority === 'Medium' ? 'bg-yellow-600 text-white' :
                                                'bg-green-600 text-white'
                                        }`}>
                                        {request.priority}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'Completed' ? 'bg-green-600 text-white' :
                                            request.status === 'In Progress' ? 'bg-blue-600 text-white' :
                                                'bg-yellow-600 text-white'
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">{request.description}</p>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">New Maintenance Request</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={newRequest.category}
                                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
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
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
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
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
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
