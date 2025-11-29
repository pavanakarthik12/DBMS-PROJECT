import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard } from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">My Information</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Name</div>
                            <div className="text-gray-900 dark:text-white">{data?.student?.name}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</div>
                            <div className="text-gray-900 dark:text-white">{data?.student?.email}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Room Number</div>
                            <div className="text-gray-900 dark:text-white">{data?.student?.room_number || 'Not Assigned'}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Roommates</h3>
                    {data?.roommates && data.roommates.length > 0 ? (
                        <ul className="space-y-3">
                            {data.roommates.map((roommate, index) => (
                                <li key={index} className="flex items-center space-x-3 text-gray-900 dark:text-white">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{roommate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No roommates</p>
                    )}
                </div>
            </div>

            {data?.payment && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Payment Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Amount</div>
                            <div className="text-gray-900 dark:text-white font-semibold">₹{data.payment.amount}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Status</div>
                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${data.payment.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                }`}>
                                {data.payment.status}
                            </span>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Deadline</div>
                            <div className="text-gray-900 dark:text-white">{new Date(data.payment.deadline).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {data?.today_menu && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Today's Menu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Breakfast</div>
                            <div className="text-gray-900 dark:text-white">{data.today_menu.breakfast || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Lunch</div>
                            <div className="text-gray-900 dark:text-white">{data.today_menu.lunch || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Snacks</div>
                            <div className="text-gray-900 dark:text-white">{data.today_menu.snacks || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Dinner</div>
                            <div className="text-gray-900 dark:text-white">{data.today_menu.dinner || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )}

            {data?.recent_complaints && data.recent_complaints.length > 0 && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Recent Complaints</h3>
                    <div className="space-y-4">
                        {data.recent_complaints.map((complaint) => (
                            <div key={complaint.complaint_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-2">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.complaint_type}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{complaint.description}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Status: {complaint.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
