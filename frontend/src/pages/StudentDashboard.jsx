import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard, createRoomChangeRequest } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const { triggerDashboardRefresh } = useDashboardRefresh();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [roomChangeRequest, setRoomChangeRequest] = useState({
        requested_room: '',
        reason: '',
    });

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchStudentDashboard(user.id);
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        if (user?.id) {
            loadDashboard();
        }
    }, [user, loadDashboard]);

    const handleRoomChangeSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!roomChangeRequest.requested_room || !roomChangeRequest.reason.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await createRoomChangeRequest({
                student_id: user.id,
                current_room: user.room_id,
                requested_room: parseInt(roomChangeRequest.requested_room),
                reason: roomChangeRequest.reason,
            });

            if (response.data.success) {
                setShowRoomChangeModal(false);
                setRoomChangeRequest({ requested_room: '', reason: '' });
                setSuccessMessage('Room change request submitted successfully');
                triggerDashboardRefresh();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError('Failed to submit room change request');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded text-sm">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">My Information</h3>
                        <button
                            onClick={() => setShowRoomChangeModal(true)}
                            className="px-2 py-1 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded transition-colors"
                        >
                            Request Room Change
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Name</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data?.student?.name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data?.student?.email}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Room Number</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data?.student?.room_number || 'Not Assigned'}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Roommates</h3>
                    {data?.roommates && data.roommates.length > 0 ? (
                        <ul className="space-y-2">
                            {data.roommates.map((roommate, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{roommate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No roommates</p>
                    )}
                </div>
            </div>

            {data?.payment && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">₹{data.payment.amount}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Status</div>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${data.payment.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                }`}>
                                {data.payment.status}
                            </span>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Deadline</div>
                            <div className="text-sm text-gray-900 dark:text-white">{new Date(data.payment.deadline).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {data?.today_menu && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Today's Menu</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Breakfast</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.breakfast || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Lunch</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.lunch || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Snacks</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.snacks || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Dinner</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.dinner || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )}

            {data?.recent_complaints && data.recent_complaints.length > 0 && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Complaints</h3>
                    <div className="space-y-3">
                        {data.recent_complaints.map((complaint) => (
                            <div key={complaint.complaint_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.complaint_type}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{complaint.description}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Status: {complaint.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showRoomChangeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded max-w-lg w-full p-5">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Request Room Change</h3>
                        <form onSubmit={handleRoomChangeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Requested Room Number</label>
                                <input
                                    type="number"
                                    value={roomChangeRequest.requested_room}
                                    onChange={(e) => setRoomChangeRequest({ ...roomChangeRequest, requested_room: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="Enter room number"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reason for Change</label>
                                <textarea
                                    value={roomChangeRequest.reason}
                                    onChange={(e) => setRoomChangeRequest({ ...roomChangeRequest, reason: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                    rows="4"
                                    placeholder="Explain why you want to change rooms..."
                                    required
                                />
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRoomChangeModal(false)}
                                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-3 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded transition-colors"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
