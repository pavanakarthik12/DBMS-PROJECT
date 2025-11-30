import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMenu, createRoomChangeRequest } from '../services/api';

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
            // Set demo data for complaints
            setComplaints([
                { complaint_id: 1, title: 'AC not working', status: 'Pending', created_at: '2024-11-25' },
                { complaint_id: 2, title: 'WiFi connectivity issue', status: 'Resolved', created_at: '2024-11-24' },
                { complaint_id: 3, title: 'Water pressure low', status: 'Pending', created_at: '2024-11-23' }
            ]);

            // Set demo student data
            setStudentData({
                name: user?.username || 'Student',
                email: user?.email || 'student@college.edu',
                room_number: user?.room_number || '101'
            });

            // Set demo menu data
            const demoMenu = {
                breakfast: 'Poha, Tea, Banana',
                lunch: 'Rice, Dal, Chicken Curry, Salad', 
                snacks: 'Samosa, Coffee',
                dinner: 'Roti, Paneer Masala, Rice'
            };
            setMenu(demoMenu);

            try {
                const menuRes = await fetchMenu();
                if (menuRes.data && menuRes.data.success) {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    setMenu(menuRes.data.data.find(m => m.day === today) || demoMenu);
                }
            } catch (err) {
                console.log('Backend menu data not available, using demo data');
            }
        } catch (error) {
            console.error('Failed to load student data', error);
        }
    };

    const handleRoomRequest = async (e) => {
        e.preventDefault();
        try {
            try {
                const response = await createRoomChangeRequest(roomRequest);
                if (response.data && response.data.success) {
                    setShowRoomModal(false);
                    setRoomRequest({ requested_room_id: '', reason: '' });
                    alert('Request submitted successfully');
                    return;
                }
            } catch (err) {
                console.log('Backend not available, simulating success');
            }
            
            // Fallback for demo
            setShowRoomModal(false);
            setRoomRequest({ requested_room_id: '', reason: '' });
            alert('Room change request submitted successfully (Demo mode)');
        } catch (error) {
            alert('Failed to submit request');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {studentData?.name || user?.username}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Student Dashboard</p>
                </div>

                {/* Premium Highlights Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Fee Payment Status */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Fee Status</p>
                                <p className="text-2xl font-bold">Paid</p>
                            </div>
                            <div className="text-3xl opacity-80">💳</div>
                        </div>
                        <p className="text-green-100 text-xs mt-2">Next due: Dec 2024</p>
                    </div>

                    {/* Room Info */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Room</p>
                                <p className="text-2xl font-bold">{studentData?.room_number || user?.room_number || 'N/A'}</p>
                            </div>
                            <div className="text-3xl opacity-80">🏠</div>
                        </div>
                        <p className="text-blue-100 text-xs mt-2">Block A, Floor 2</p>
                    </div>

                    {/* Attendance */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Attendance</p>
                                <p className="text-2xl font-bold">95%</p>
                            </div>
                            <div className="text-3xl opacity-80">📊</div>
                        </div>
                        <p className="text-purple-100 text-xs mt-2">This month</p>
                    </div>

                    {/* Pending Issues */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Pending Issues</p>
                                <p className="text-2xl font-bold">{complaints.length}</p>
                            </div>
                            <div className="text-3xl opacity-80">⚠️</div>
                        </div>
                        <p className="text-orange-100 text-xs mt-2">Complaints & requests</p>
                    </div>
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="text-2xl mr-3">🍽️</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Menu</h2>
                    </div>
                    {menu ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                                <div className="flex items-center mb-2">
                                    <span className="text-lg mr-2">🌅</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Breakfast</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{menu.breakfast}</span>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border-l-4 border-green-400">
                                <div className="flex items-center mb-2">
                                    <span className="text-lg mr-2">☀️</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Lunch</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{menu.lunch}</span>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-center mb-2">
                                    <span className="text-lg mr-2">🍪</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Snacks</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{menu.snacks}</span>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border-l-4 border-purple-400">
                                <div className="flex items-center mb-2">
                                    <span className="text-lg mr-2">🌙</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Dinner</span>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{menu.dinner}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">🍽️</div>
                            <p className="text-gray-500 dark:text-gray-400">Menu not available</p>
                        </div>
                    )}
                </div>

                {/* Recent Complaints */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="text-2xl mr-3">📝</div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Complaints</h2>
                    </div>
                    <div className="space-y-4">
                        {complaints.length > 0 ? (
                            complaints.map((c) => (
                                <div key={c.complaint_id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white mb-2">{c.title}</div>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                                                <span>📅</span>
                                                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${c.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                            {c.status === 'Resolved' ? '✅ Resolved' : '⏳ Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">✅</div>
                                <p className="text-gray-500 dark:text-gray-400">No recent complaints</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
                            </div>
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
        </div>
    );
};

export default StudentDashboard;
