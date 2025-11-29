import React, { useState, useEffect } from 'react';
import { fetchAdminDashboard, fetchComplaints, fetchMaintenance, fetchWaitingList } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [recentActivity, setRecentActivity] = useState({ complaints: [], maintenance: [], waitingList: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { refreshTrigger } = useDashboardRefresh();

    useEffect(() => {
        loadDashboard();
    }, [refreshTrigger]);

    useEffect(() => {
        const interval = setInterval(loadDashboard, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [dashboardRes, complaintsRes, maintenanceRes, waitingListRes] = await Promise.all([
                fetchAdminDashboard(),
                fetchComplaints(),
                fetchMaintenance(),
                fetchWaitingList()
            ]);

            if (dashboardRes.data.success) {
                setData(dashboardRes.data.data);
            }

            setRecentActivity({
                complaints: complaintsRes.data.success ? complaintsRes.data.data.slice(0, 5) : [],
                maintenance: maintenanceRes.data.success ? maintenanceRes.data.data.slice(0, 5) : [],
                waitingList: waitingListRes.data.success ? waitingListRes.data.data.slice(0, 5) : []
            });
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
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

    const kpis = [
        { label: 'Total Rooms', value: data?.total_rooms || 0 },
        { label: 'Total Students', value: data?.total_students || 0 },
        { label: 'Occupancy Rate', value: `${data?.occupancy_rate || 0}%` },
        { label: 'Pending Payments', value: data?.pending_payments || 0 },
        { label: 'Active Complaints', value: data?.pending_complaints || 0 },
        { label: 'Maintenance Requests', value: data?.pending_maintenance || 0 },
        { label: 'Waiting List', value: data?.waiting_list || 0 },
    ];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{kpi.label}</div>
                        <div className="text-3xl font-semibold text-gray-900 dark:text-white">{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Today's Menu */}
            {data?.today_menu && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Today's Menu</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Breakfast</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.breakfast || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lunch</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.lunch || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Snacks</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.snacks || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dinner</div>
                            <div className="text-sm text-gray-900 dark:text-white">{data.today_menu.dinner || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Recent Complaints */}
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-4">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-3">Recent Complaints</h4>
                        <div className="space-y-3">
                            {recentActivity.complaints.length > 0 ? (
                                recentActivity.complaints.map((complaint) => (
                                    <div key={complaint.complaint_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                        <div className="text-sm text-gray-900 dark:text-white">{complaint.complaint_type}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{complaint.name}</div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Room {complaint.room_number}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400">No recent complaints</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Maintenance */}
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-4">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-3">Maintenance Requests</h4>
                        <div className="space-y-3">
                            {recentActivity.maintenance.length > 0 ? (
                                recentActivity.maintenance.map((request) => (
                                    <div key={request.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                        <div className="text-sm text-gray-900 dark:text-white">{request.category}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{request.priority} Priority</div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Room {request.room_id}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400">No maintenance requests</div>
                            )}
                        </div>
                    </div>

                    {/* Waiting List */}
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-4">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-3">Waiting List</h4>
                        <div className="space-y-3">
                            {recentActivity.waitingList.length > 0 ? (
                                recentActivity.waitingList.map((person) => (
                                    <div key={person.waiting_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                        <div className="text-sm text-gray-900 dark:text-white">{person.student_name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{person.phone}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400">No waiting list entries</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
