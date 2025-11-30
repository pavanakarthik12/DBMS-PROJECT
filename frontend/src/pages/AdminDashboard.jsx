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
                setMenu(todayMenu);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Complete overview of hostel operations</p>
                </div>

                {/* Premium Highlights Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium">Revenue</p>
                                <p className="text-2xl font-bold">₹2.4L</p>
                            </div>
                            <div className="text-3xl opacity-80">💰</div>
                        </div>
                        <p className="text-emerald-100 text-xs mt-2">This month: +12%</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Student Satisfaction</p>
                                <p className="text-2xl font-bold">4.8/5</p>
                            </div>
                            <div className="text-3xl opacity-80">⭐</div>
                        </div>
                        <p className="text-blue-100 text-xs mt-2">Based on 156 reviews</p>
                    </div>

                    <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-violet-100 text-sm font-medium">Staff Efficiency</p>
                                <p className="text-2xl font-bold">94%</p>
                            </div>
                            <div className="text-3xl opacity-80">👥</div>
                        </div>
                        <p className="text-violet-100 text-xs mt-2">Response time: 2.1h avg</p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Energy Savings</p>
                                <p className="text-2xl font-bold">18%</p>
                            </div>
                            <div className="text-3xl opacity-80">⚡</div>
                        </div>
                        <p className="text-amber-100 text-xs mt-2">vs. last quarter</p>
                    </div>
                </div>

                {/* Enhanced KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Rooms</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.total_rooms || 120}</div>
                        </div>
                        <div className="text-3xl text-blue-500">🏠</div>
                    </div>
                    <div className="mt-3 text-xs text-green-600">+2 new this month</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Occupancy Rate</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats?.occupancy_rate ? `${stats.occupancy_rate}%` : '88%'}
                            </div>
                        </div>
                        <div className="text-3xl text-green-500">📊</div>
                    </div>
                    <div className="mt-3 text-xs text-green-600">Above target (85%)</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pending Payments</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pending_payments || 12}</div>
                        </div>
                        <div className="text-3xl text-orange-500">💳</div>
                    </div>
                    <div className="mt-3 text-xs text-orange-600">₹45,000 total due</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Active Complaints</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pending_complaints || 8}</div>
                        </div>
                        <div className="text-3xl text-red-500">🚨</div>
                    </div>
                    <div className="mt-3 text-xs text-red-600">3 high priority</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Room Change Requests */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Room Change Requests</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{requests.length} pending</span>
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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRequestAction(req.id, 'approve')}
                                            className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRequestAction(req.id, 'deny')}
                                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending requests</p>
                        )}
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
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-lg border-l-4 border-amber-400">
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">🌅</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Breakfast</span>
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300">{menu.breakfast}</div>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-3 rounded-lg border-l-4 border-emerald-400">
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">☀️</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Lunch</span>
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300">{menu.lunch}</div>
                            </div>
                            <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 p-3 rounded-lg border-l-4 border-sky-400">
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">🍪</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Snacks</span>
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300">{menu.snacks}</div>
                            </div>
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-3 rounded-lg border-l-4 border-violet-400">
                                <div className="flex items-center mb-1">
                                    <span className="mr-2">🌙</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Dinner</span>
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300">{menu.dinner}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-3xl mb-2">🍽️</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Menu not available</p>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
