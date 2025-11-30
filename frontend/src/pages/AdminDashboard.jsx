import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchRoomChangeRequests, approveRoomChangeRequest, denyRoomChangeRequest, fetchMenu } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setMenu(demoMenu);
            
            const [statsRes, requestsRes, menuRes] = await Promise.all([
                fetchDashboardStats(),
                fetchRoomChangeRequests(),
                fetchMenu()
            ]);

            if (statsRes.data.success) setStats(statsRes.data.data);
            if (requestsRes.data.success) setRequests(requestsRes.data.data);
            if (menuRes.data.success) {
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const todayMenu = menuRes.data.data.find(m => m.day === today);
                setMenu(todayMenu || demoMenu);
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
            if (response.data.success) {
                loadDashboardData();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('Failed to process request');
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
                    {menu ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">Breakfast</h3>
                                <p className="text-lg">{menu.breakfast}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">Lunch</h3>
                                <p className="text-lg">{menu.lunch}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">Snacks</h3>
                                <p className="text-lg">{menu.snacks}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-2">Dinner</h3>
                                <p className="text-lg">{menu.dinner}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xl">Menu not available</p>
                    )}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Room Change Requests */}
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-8 rounded-lg">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Change Requests</h2>
                        <span className="bg-red-600 text-white px-4 py-2 rounded font-bold">{requests.length} pending</span>
                    </div>
                    <div className="space-y-4">
                        {requests.length > 0 ? (
                            requests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{req.student_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Room {req.current_room} → Room {req.requested_room}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">Reason: {req.reason}</div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleRequestAction(req.id, 'approve')}
                                            className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(req.id, 'deny')}
                                            className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700"
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
            </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
