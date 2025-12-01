import React, { useState, useEffect } from 'react';
import { fetchComplaints, createComplaint, resolveComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ComplaintsPage = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            setLoading(true);
            const response = await fetchComplaints();
            if (response.data && response.data.success) {
                setComplaints(response.data.data);
            } else {
                setError('Failed to load complaints');
            }
        } catch (err) {
            setError('Failed to load complaints data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await createComplaint(newComplaint);
            if (response.data && response.data.success) {
                setShowModal(false);
                setNewComplaint({ title: '', description: '' });
                loadComplaints();
                alert('Complaint submitted successfully!');
            } else {
                alert(response.data?.message || 'Failed to submit complaint');
            }
        } catch (err) {
            console.error('Error submitting complaint:', err);
            alert('Failed to submit complaint: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            const response = await resolveComplaint(id);
            if (response.data && response.data.success) {
                loadComplaints();
                alert('Complaint marked as resolved successfully!');
            } else {
                alert(response.data?.message || 'Failed to resolve complaint');
            }
        } catch (err) {
            console.error('Error resolving complaint:', err);
            alert('Failed to resolve complaint: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Resolved') {
            return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        } else if (status === 'In Progress') {
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        } else {
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
        }
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
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Complaints</h1>
                    <p className="text-gray-600 dark:text-gray-400">Report and track issues</p>
                </div>
                {user?.type === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        New Complaint
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint Title / Problem</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                {user?.type === 'admin' && (
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {complaints.map((complaint) => (
                                <tr key={complaint.complaint_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {user?.type === 'admin' ? complaint.student_name : 'You'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {complaint.room_number}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        <div className="font-medium">{complaint.title}</div>
                                        <div className="text-gray-500 dark:text-gray-400 mt-1">{complaint.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    {user?.type === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {complaint.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => handleResolve(complaint.complaint_id)}
                                                    className="text-accent hover:text-accent-hover transition-colors"
                                                >
                                                    Mark as Resolved
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {complaints.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No complaints found</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">New Complaint</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newComplaint.title}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                    className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    placeholder="Brief title of the issue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newComplaint.description}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                    className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent transition-all h-32 resize-none"
                                    placeholder="Detailed description..."
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
                                    {submitting ? 'Submitting...' : 'Submit Complaint'}
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
