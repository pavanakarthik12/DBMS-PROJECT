import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMenu, createRoomChangeRequest, fetchComplaints } from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [menu, setMenu] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [roomRequest, setRoomRequest] = useState({ requested_room_id: '', reason: '' });

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user?.id]);

    const loadData = async () => {
        try {
            const [dashboardRes, menuRes, complaintsRes] = await Promise.all([
                fetchStudentDashboard(user.id),
                fetchMenu(),
                fetchComplaints()
            ]);

            if (dashboardRes.data.success) {
                setStudentData(dashboardRes.data.data.student);
            }

            if (menuRes.data.success) {
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                setMenu(menuRes.data.data.find(m => m.day === today));
            }
            if (complaintsRes.data.success) {
                setComplaints(complaintsRes.data.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to load student data', error);
        }
    };

    const handleRoomRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await createRoomChangeRequest(roomRequest);
            if (response.data.success) {
                setShowRoomModal(false);
                alert('Request submitted successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('Failed to submit request');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Welcome, {studentData?.name || user?.username}</h1>
                <p className="text-gray-600 dark:text-gray-400">Student Dashboard</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Info */}
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Information</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Room Number</span>
                            <span className="font-medium text-gray-900 dark:text-white">{studentData?.room_number || user?.room_number || 'Not Assigned'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Email</span>
                            <span className="font-medium text-gray-900 dark:text-white">{studentData?.email || user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Status</span>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Active</span>
                        </div>
                        <button
                            onClick={() => setShowRoomModal(true)}
                            className="w-full mt-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded transition-colors"
                        >
                            Request Room Change
                        </button>
                    </div>
                </div>

                {/* Today's Menu */}
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Today's Menu</h2>
                    {menu ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Breakfast</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{menu.breakfast}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Lunch</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{menu.lunch}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Snacks</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{menu.snacks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Dinner</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{menu.dinner}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Menu not available</p>
                    )}
                </div>

                {/* Recent Complaints */}
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Complaints</h2>
                    <div className="space-y-4">
                        {complaints.length > 0 ? (
                            complaints.map((c) => (
                                <div key={c.complaint_id} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-800">
                                    <div className="font-medium text-sm text-gray-900 dark:text-white">{c.title}</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No recent complaints</p>
                        )}
                    </div>
                </div>
            </div>

            {showRoomModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Room Change</h2>
                        <form onSubmit={handleRoomRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requested Room ID</label>
                                <input
                                    type="number"
                                    value={roomRequest.requested_room_id}
                                    onChange={(e) => setRoomRequest({ ...roomRequest, requested_room_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded focus:ring-2 focus:ring-accent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                                <textarea
                                    value={roomRequest.reason}
                                    onChange={(e) => setRoomRequest({ ...roomRequest, reason: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded focus:ring-2 focus:ring-accent outline-none h-24 resize-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRoomModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover"
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
