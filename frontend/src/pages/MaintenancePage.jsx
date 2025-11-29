import React, { useState, useEffect } from 'react';
import { fetchMaintenanceRequests, createMaintenanceRequest, resolveMaintenanceRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MaintenancePage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const response = await fetchMaintenanceRequests();
            if (response.data.success) {
                setRequests(response.data.data);
            } else {
                setError('Failed to load maintenance requests');
            }
        } catch (err) {
            setError('Failed to load maintenance data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await createMaintenanceRequest(newRequest);
            if (response.data.success) {
                setShowModal(false);
                setNewRequest({ title: '', description: '' });
                loadRequests();
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            const response = await resolveMaintenanceRequest(id);
            if (response.data.success) {
                loadRequests();
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert('Failed to resolve request');
        }
    };

    const getStatusColor = (status) => {
        return status === 'Resolved'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Maintenance</h1>
                    <p className="text-gray-600 dark:text-gray-400">Request repairs and services</p>
                </div>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        New Request
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {requests.map((request) => (
                    <div key={request.request_id} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{request.title}</h3>
                                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                    {user?.type === 'admin' && <span>• {request.student_name} (Room {request.room_number})</span>}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{request.description}</p>

                        {user?.type === 'admin' && request.status !== 'Resolved' && (
                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => handleResolve(request.request_id)}
                                    className="text-accent hover:text-accent-hover font-medium text-sm transition-colors"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No maintenance requests found</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">New Maintenance Request</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newRequest.title}
                                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                    placeholder="e.g., Leaking Tap, Broken Light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newRequest.description}
                                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all h-32 resize-none"
                                    placeholder="Detailed description of the issue..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Request'}
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
