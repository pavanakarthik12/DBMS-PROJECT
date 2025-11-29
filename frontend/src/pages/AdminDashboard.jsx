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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Overview of hostel activities</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Rooms</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">{stats?.total_rooms || 0}</div>
                </div>
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Occupancy Rate</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                        {stats?.occupancy_rate ? `${stats.occupancy_rate}%` : '0%'}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pending Payments</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">{stats?.pending_payments || 0}</div>
                </div>
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Active Complaints</div>
                    <div className="text-3xl font-semibold text-gray-900 dark:text-white">{stats?.pending_complaints || 0}</div>
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
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Today's Menu</h2>
                    {menu ? (
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Breakfast</div>
                                <div className="text-sm text-gray-900 dark:text-white">{menu.breakfast}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Lunch</div>
                                <div className="text-sm text-gray-900 dark:text-white">{menu.lunch}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Snacks</div>
                                <div className="text-sm text-gray-900 dark:text-white">{menu.snacks}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Dinner</div>
                                <div className="text-sm text-gray-900 dark:text-white">{menu.dinner}</div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Menu not available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
