import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard } from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id) {
            loadDashboard();
        }
    }, [user]);

    const loadDashboard = async () => {
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
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Information</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                            <p className="text-gray-900 dark:text-white">{data?.student?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                            <p className="text-gray-900 dark:text-white">{data?.student?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Room Number</p>
                            <p className="text-gray-900 dark:text-white">{data?.student?.room_number || 'Not Assigned'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roommates</h3>
                    {data?.roommates && data.roommates.length > 0 ? (
                        <ul className="space-y-3">
                            {data.roommates.map((roommate, index) => (
                                <li key={index} className="flex items-center space-x-3 text-gray-900 dark:text-white">
                                    <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{roommate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No roommates</p>
                    )}
                </div>
            </div>

            {data?.payment && (
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                            <p className="text-gray-900 dark:text-white font-semibold">₹{data.payment.amount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${data.payment.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                }`}>
                                {data.payment.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline</p>
                            <p className="text-gray-900 dark:text-white">{new Date(data.payment.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {data?.today_menu && (
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Menu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Breakfast</p>
                            <p className="text-gray-900 dark:text-white">{data.today_menu.breakfast || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lunch</p>
                            <p className="text-gray-900 dark:text-white">{data.today_menu.lunch || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dinner</p>
                            <p className="text-gray-900 dark:text-white">{data.today_menu.dinner || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            {data?.recent_complaints && data.recent_complaints.length > 0 && (
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Complaints</h3>
                    <div className="space-y-4">
                        {data.recent_complaints.map((complaint) => (
                            <div key={complaint.complaint_id} className="border-l-4 border-accent-blue pl-4 py-2">
                                <p className="text-gray-900 dark:text-white font-medium">{complaint.complaint_type}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{complaint.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Status: {complaint.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
