import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchRoomChangeRequests, approveRoomChangeRequest, denyRoomChangeRequest, fetchMenu, fetchRoomDetails, fetchWaitingList, assignWaitingStudent } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [roomDetails, setRoomDetails] = useState(null);
    const [showRoomDetails, setShowRoomDetails] = useState(false);
    const { refreshTrigger } = useDashboardRefresh();

    useEffect(() => {
        loadDashboardData();
    }, [refreshTrigger]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Set demo menu data
            const demoMenu = {
                breakfast: 'Poha, Tea, Banana',
                lunch: 'Rice, Dal, Chicken Curry, Salad',
                snacks: 'Samosa, Coffee',
                dinner: 'Roti, Paneer Masala, Rice'
            };
            
            // Set demo menu immediately to ensure something is displayed
            setMenu(demoMenu);

            const [statsRes, requestsRes, menuRes] = await Promise.all([
                fetchDashboardStats(),
                fetchRoomChangeRequests(),
                fetchMenu()
            ]);

            if (statsRes.data && statsRes.data.success) setStats(statsRes.data.data);
            if (requestsRes.data && requestsRes.data.success) setRequests(requestsRes.data.data);
            if (menuRes.data && menuRes.data.success && menuRes.data.data) {
                console.log('Menu data received:', menuRes.data.data);
                // If we get menu data, try to find today's menu
                if (Array.isArray(menuRes.data.data)) {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    console.log('Today is:', today);
                    const todayMenu = menuRes.data.data.find(m => m.day === today);
                    console.log('Todays menu found:', todayMenu);
                    if (todayMenu) {
                        setMenu({
                            breakfast: todayMenu.breakfast || demoMenu.breakfast,
                            lunch: todayMenu.lunch || demoMenu.lunch,
                            snacks: todayMenu.snacks || demoMenu.snacks,
                            dinner: todayMenu.dinner || demoMenu.dinner
                        });
                    }
                } else {
                    // If menu data is not an array, use it directly
                    console.log('Direct menu data:', menuRes.data.data);
                    setMenu({
                        breakfast: menuRes.data.data.breakfast || demoMenu.breakfast,
                        lunch: menuRes.data.data.lunch || demoMenu.lunch,
                        snacks: menuRes.data.data.snacks || demoMenu.snacks,
                        dinner: menuRes.data.data.dinner || demoMenu.dinner
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (id, action) => {
        try {
            const apiCall = action === 'approve' ? approveRoomChangeRequest : denyRoomChangeRequest;
            const response = await apiCall(id);
            if (response.data && response.data.success) {
                // Remove the processed request from the list immediately
                setRequests(prevRequests => prevRequests.filter(req => req.request_id !== id));
                alert(`Request ${action}d successfully!`);
                // Reload dashboard data to update statistics
                loadDashboardData();
            } else {
                alert(response.data?.message || `Failed to ${action} request`);
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
            alert(`Failed to ${action} request: ` + (error.response?.data?.message || error.message));
        }
    };

    const handleRoomDetailsView = async () => {
        if (!selectedRoom) {
            alert('Please enter a room number');
            return;
        }

        try {
            const response = await fetchRoomDetails(selectedRoom);
            if (response.data && response.data.success) {
                setRoomDetails(response.data.data);
                setShowRoomDetails(true);
            } else {
                alert(response.data?.message || 'Room not found');
            }
        } catch (error) {
            console.error('Error fetching room details:', error);
            alert('Failed to fetch room details');
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
        <div className="p-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto space-y-12">
                <div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Admin Dashboard</h1>
                    <p className="text-2xl text-gray-700 dark:text-gray-300">Complete overview of hostel operations</p>
                </div>

                {/* Today's Menu Block */}
                <div className="bg-blue-600 text-white p-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-6">Today's Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-2">Breakfast</h3>
                            <p className="text-lg">{menu?.breakfast || 'Poha, Tea, Banana'}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-2">Lunch</h3>
                            <p className="text-lg">{menu?.lunch || 'Rice, Dal, Chicken Curry, Salad'}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-2">Snacks</h3>
                            <p className="text-lg">{menu?.snacks || 'Samosa, Coffee'}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-2">Dinner</h3>
                            <p className="text-lg">{menu?.dinner || 'Roti, Paneer Masala, Rice'}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-green-600 text-white p-8 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-medium">Revenue</p>
                                <p className="text-3xl font-bold">₹2.4L</p>
                            </div>
                        </div>
                        <p className="text-lg mt-2">This month: +12%</p>
                    </div>

                    <div className="bg-blue-600 text-white p-8 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-medium">Student Satisfaction</p>
                                <p className="text-3xl font-bold">4.8/5</p>
                            </div>
                        </div>
                        <p className="text-lg mt-2">Based on 156 reviews</p>
                    </div>

                    <div className="bg-purple-600 text-white p-8 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-medium">Staff Efficiency</p>
                                <p className="text-3xl font-bold">94%</p>
                            </div>
                        </div>
                        <p className="text-lg mt-2">Response time: 2.1h avg</p>
                    </div>

                    <div className="bg-orange-600 text-white p-8 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xl font-medium">Energy Savings</p>
                                <p className="text-3xl font-bold">18%</p>
                            </div>
                        </div>
                        <p className="text-lg mt-2">vs. last quarter</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Total Rooms</div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats?.total_rooms || 120}</div>
                        </div>
                        <div className="mt-4 text-lg text-green-600 font-semibold">+2 new this month</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Occupancy Rate</div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                {stats?.occupancy_rate ? `${stats.occupancy_rate}%` : '88%'}
                            </div>
                        </div>
                        <div className="mt-4 text-lg text-green-600 font-semibold">Above target (85%)</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pending Payments</div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats?.pending_payments || 12}</div>
                        </div>
                        <div className="mt-4 text-lg text-orange-600 font-semibold">₹45,000 total due</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Active Complaints</div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats?.pending_complaints || 8}</div>
                        </div>
                        <div className="mt-4 text-lg text-red-600 font-semibold">3 high priority</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Room Change Requests */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Change Requests</h2>
                            <span className="bg-red-600 text-white px-4 py-2 rounded font-bold">{requests.length} pending</span>
                        </div>
                        <div className="space-y-4">
                            {requests.length > 0 ? (
                                requests.map((req) => (
                                    <div key={req.request_id} className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="mb-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{req.student_name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Room {req.current_room_number || req.current_room} → Room {req.requested_room_number || req.requested_room}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">Reason: {req.reason}</div>
                                            <div className="text-xs text-gray-400 mt-1">Date: {new Date(req.request_date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleRequestAction(req.request_id, 'approve')}
                                                className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRequestAction(req.request_id, 'deny')}
                                                className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 text-sm"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 text-center py-8 text-xl">No pending requests</p>
                            )}
                        </div>
                    </div>

                    {/* Empty column to maintain grid structure */}
                    <div></div>

                    {/* Room Details Viewer */}
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Room Details</h2>
                        <div className="space-y-6">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Enter room number"
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    className="flex-1 px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRoomDetailsView();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleRoomDetailsView}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                >
                                    View Details
                                </button>
                            </div>

                            {showRoomDetails && roomDetails && (
                                <div className="border-t pt-6">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Room Number:</span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">{roomDetails.room_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">{roomDetails.capacity}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Current Occupancy:</span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">{roomDetails.current_occupancy}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">Available Beds:</span>
                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">{roomDetails.capacity - roomDetails.current_occupancy}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Students in Room</h3>
                                        {roomDetails.students && roomDetails.students.length > 0 ? (
                                            <div className="space-y-3">
                                                {roomDetails.students.map((student, index) => (
                                                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">{student.email}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Branch: {student.branch || 'Not provided'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Year: {student.year_of_study || 'Not provided'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Phone: {student.phone || 'Not provided'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Student ID: {student.student_id}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment: </span>
                                                                {student.payment_status ? (
                                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {student.payment_status}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400">Not provided</span>
                                                                )}
                                                            </div>
                                                            {student.maintenance_problems && (
                                                                <div className="col-span-2">
                                                                    <span className="text-sm text-red-600 dark:text-red-400">Maintenance: {student.maintenance_problems}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No students in this room</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default AdminDashboard;