import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMenu, createRoomChangeRequest, fetchAvailableRooms, fetchStudentDashboard } from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [menu, setMenu] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [roomRequest, setRoomRequest] = useState({ requested_room_id: '', reason: '' });



    const loadData = useCallback(async () => {
        try {
            // Set demo data for complaints
            setComplaints([
                { complaint_id: 1, title: 'AC not working', status: 'Pending', created_at: '2024-11-25' },
                { complaint_id: 2, title: 'WiFi connectivity issue', status: 'Resolved', created_at: '2024-11-24' },
                { complaint_id: 3, title: 'Water pressure low', status: 'Pending', created_at: '2024-11-23' }
            ]);

            // Try to get real student data from API
            try {
                const studentRes = await fetchStudentDashboard(user?.id || 1);
                if (studentRes.data && studentRes.data.success) {
                    const studentInfo = studentRes.data.data.student;
                    setStudentData({
                        name: studentInfo.name || user?.username || 'Student',
                        email: studentInfo.email || user?.email || 'student@college.edu',
                        room_number: studentInfo.room_number || user?.room_number || 'Not Assigned',
                        branch: studentInfo.branch,
                        year_of_study: studentInfo.year_of_study,
                        payment_status: studentRes.data.data.payment?.status,
                        roommates: studentRes.data.data.roommates || []
                    });
                } else {
                    // Fallback to user data
                    setStudentData({
                        name: user?.username || 'Student',
                        email: user?.email || 'student@college.edu',
                        room_number: user?.room_number || 'Not Assigned',
                        roommates: []
                    });
                }
            } catch (err) {
                // Fallback to user data
                setStudentData({
                    name: user?.username || 'Student',
                    email: user?.email || 'student@college.edu',
                    room_number: user?.room_number || 'Not Assigned',
                    roommates: []
                });
            }

            // Load menu data
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
                    const todayMenu = menuRes.data.data.filter(m => m.day === today);
                    if (todayMenu.length > 0) {
                        const menuObj = {};
                        todayMenu.forEach(meal => {
                            menuObj[meal.meal_type.toLowerCase()] = meal.item_name;
                        });
                        setMenu(menuObj);
                    }
                }
            } catch (err) {
                console.log('Backend menu data not available, using demo data');
            }
        } catch (error) {
            console.error('Failed to load student data', error);
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user?.id, loadData]);

    const loadAvailableRooms = async () => {
        try {
            const response = await fetchAvailableRooms();
            if (response.data && response.data.success) {
                setAvailableRooms(response.data.data);
            } else {
                // Demo data for available rooms
                setAvailableRooms([
                    { room_id: 101, room_number: '101', capacity: 2, current_occupancy: 1, available_spots: 1 },
                    { room_id: 102, room_number: '102', capacity: 3, current_occupancy: 1, available_spots: 2 },
                    { room_id: 201, room_number: '201', capacity: 2, current_occupancy: 0, available_spots: 2 },
                    { room_id: 203, room_number: '203', capacity: 4, current_occupancy: 2, available_spots: 2 }
                ]);
            }
        } catch (error) {
            console.log('Backend not available, using demo data');
            setAvailableRooms([
                { room_id: 101, room_number: '101', capacity: 2, current_occupancy: 1, available_spots: 1 },
                { room_id: 102, room_number: '102', capacity: 3, current_occupancy: 1, available_spots: 2 },
                { room_id: 201, room_number: '201', capacity: 2, current_occupancy: 0, available_spots: 2 },
                { room_id: 203, room_number: '203', capacity: 4, current_occupancy: 2, available_spots: 2 }
            ]);
        }
    };

    const handleRoomRequest = async (e) => {
        e.preventDefault();
        if (!roomRequest.requested_room_id || !roomRequest.reason.trim()) {
            alert('Please select a room and provide a reason');
            return;
        }

        try {
            const requestData = {
                student_id: user?.id || 1,
                current_room: user?.room_id || 1,
                requested_room: parseInt(roomRequest.requested_room_id),
                reason: roomRequest.reason.trim()
            };

            const response = await createRoomChangeRequest(requestData);
            if (response.data && response.data.success) {
                setShowRoomModal(false);
                setRoomRequest({ requested_room_id: '', reason: '' });
                alert('Room change request submitted successfully!');
                // Refresh data to get any updates
                loadData();
            } else {
                alert('Failed to submit request: ' + (response.data?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Error submitting request. Please try again.');
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
                    <div className={`bg-gradient-to-r ${studentData?.payment_status === 'Paid'
                        ? 'from-green-500 to-green-600'
                        : 'from-red-500 to-red-600'
                        } text-white p-6 rounded-xl shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${studentData?.payment_status === 'Paid' ? 'text-green-100' : 'text-red-100'
                                    } text-sm font-medium`}>Fee Status</p>
                                <p className="text-2xl font-bold">{studentData?.payment_status || 'Not Paid'}</p>
                            </div>
                            <div className="text-3xl opacity-80">💳</div>
                        </div>
                        <p className={`${studentData?.payment_status === 'Paid' ? 'text-green-100' : 'text-red-100'
                            } text-xs mt-2`}>
                            {studentData?.payment_status === 'Paid' ? 'Up to date' : 'Payment Due'}
                        </p>
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
                                <span className="text-gray-500 dark:text-gray-400">Branch</span>
                                <span className="font-medium text-gray-900 dark:text-white">{studentData?.branch || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Year of Study</span>
                                <span className="font-medium text-gray-900 dark:text-white">{studentData?.year_of_study || 'Not specified'}</span>
                            </div>
                            {studentData?.roommates && studentData.roommates.length > 0 && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block mb-2">Roommates</span>
                                    <div className="space-y-1">
                                        {studentData.roommates.map((roommate, index) => (
                                            <div key={index} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {roommate}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Active</span>
                            </div>
                            <button
                                onClick={() => {
                                    setShowRoomModal(true);
                                    loadAvailableRooms();
                                }}
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

                    {/* Maintenance Problems History */}
                    {studentData?.maintenance_problems && studentData.maintenance_problems.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <div className="text-2xl mr-3">🔧</div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maintenance History</h2>
                            </div>
                            <div className="space-y-4">
                                {studentData.maintenance_problems.map((problem, index) => (
                                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900 dark:text-white">{problem.category}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${problem.status === 'Resolved'
                                                ? 'bg-green-100 text-green-700'
                                                : problem.status === 'Pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {problem.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{problem.description}</p>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Reported: {new Date(problem.created_at).toLocaleDateString()}</span>
                                            {problem.resolved_at && (
                                                <span>Resolved: {new Date(problem.resolved_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg max-w-lg w-full p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Room Change</h2>
                            <form onSubmit={handleRoomRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Rooms</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {availableRooms.length > 0 ? (
                                            availableRooms.map((room) => (
                                                <div
                                                    key={room.room_id}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${roomRequest.requested_room_id === room.room_id.toString()
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                    onClick={() => setRoomRequest({ ...roomRequest, requested_room_id: room.room_id.toString() })}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-medium text-gray-900 dark:text-white">Room {room.room_number}</span>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {room.current_occupancy}/{room.capacity} occupied • {room.available_spots} spot{room.available_spots !== 1 ? 's' : ''} available
                                                            </div>
                                                        </div>
                                                        {roomRequest.requested_room_id === room.room_id.toString() && (
                                                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">Loading available rooms...</p>
                                        )}
                                    </div>
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
