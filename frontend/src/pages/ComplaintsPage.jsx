import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchComplaints, createComplaint, updateComplaint } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const ComplaintsPage = () => {
    const { user } = useAuth();
    const { triggerDashboardRefresh } = useDashboardRefresh();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newComplaint, setNewComplaint] = useState({
        complaint_type: '',
        description: '',
    });

    const loadComplaints = useCallback(async () => {
        try {
            setLoading(true);
            const studentId = user?.type === 'student' ? user.id : null;
            const response = await fetchComplaints(studentId);
            if (response.data.success) {
                setComplaints(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadComplaints();
        const interval = setInterval(loadComplaints, 5000);
        return () => clearInterval(interval);
    }, [loadComplaints]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createComplaint({
                student_id: user.id,
                room_id: user.room_id || 1,
                complaint_type: newComplaint.complaint_type,
                description: newComplaint.description,
            });
            if (response.data.success) {
                setShowModal(false);
                setNewComplaint({ complaint_type: '', description: '' });
                await loadComplaints();
                triggerDashboardRefresh();
            }
        } catch (err) {
            setError('Failed to create complaint');
        }
    };

    const handleUpdateStatus = async (complaintId, status) => {
        try {
            const response = await updateComplaint(complaintId, status);
            if (response.data.success) {
                await loadComplaints();
                triggerDashboardRefresh();
            }
        } catch (err) {
            setError('Failed to update complaint');
        }
    };

    if (loading && complaints.length === 0) {
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
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Complaints</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{complaints.length} total complaints</p>
                </div>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-5 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Raise Complaint
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {complaints.map((complaint) => (
                    <div key={complaint.complaint_id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{complaint.complaint_type}</h3>
                                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                        complaint.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">{complaint.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                    {user?.type === 'admin' && <span className="font-medium">{complaint.name}</span>}
                                    <span>Room {complaint.room_number || 'N/A'}</span>
                                    <span>{new Date(complaint.raised_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {user?.type === 'admin' && complaint.status !== 'Resolved' && (
                                <div className="flex space-x-2 ml-4">
                                    {complaint.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(complaint.complaint_id, 'In Progress')}
                                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-md transition-colors"
                                        >
                                            Start Progress
                                        </button>
                                    )}
                                    {complaint.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleUpdateStatus(complaint.complaint_id, 'Resolved')}
                                            className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded-md transition-colors"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Raise New Complaint</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                <input
                                    type="text"
                                    value={newComplaint.complaint_type}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, complaint_type: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newComplaint.description}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
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

export default ComplaintsPage;
