import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        loadComplaints();
        const interval = setInterval(loadComplaints, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const loadComplaints = async () => {
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
    };

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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Complaints</h2>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Raise Complaint
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-6 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {complaints.map((complaint) => (
                    <div key={complaint.complaint_id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{complaint.complaint_type}</h3>
                                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${complaint.status === 'Resolved' ? 'bg-green-600 text-white' :
                                        complaint.status === 'In Progress' ? 'bg-blue-600 text-white' :
                                            'bg-yellow-600 text-white'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">{complaint.description}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                                    {user?.type === 'admin' && <span className="font-medium">{complaint.name}</span>}
                                    <span>Room: {complaint.room_number || 'N/A'}</span>
                                    <span>{new Date(complaint.raised_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {user?.type === 'admin' && complaint.status !== 'Resolved' && (
                                <div className="flex space-x-3 ml-4">
                                    {complaint.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(complaint.complaint_id, 'In Progress')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
                                        >
                                            Start Progress
                                        </button>
                                    )}
                                    {complaint.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleUpdateStatus(complaint.complaint_id, 'Resolved')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors font-medium"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg max-w-md w-full p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Raise New Complaint</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Type</label>
                                <input
                                    type="text"
                                    value={newComplaint.complaint_type}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, complaint_type: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-accent-blue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Description</label>
                                <textarea
                                    value={newComplaint.description}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
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

export default ComplaintsPage;
