import React, { useState, useEffect } from 'react';
import { fetchAdminDashboard, fetchComplaints, fetchMaintenance, fetchWaitingList, fetchRoomChangeRequests, approveRoomChangeRequest, denyRoomChangeRequest } from '../services/api';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [recentActivity, setRecentActivity] = useState({ complaints: [], maintenance: [], waitingList: [] });
    const [roomChangeRequests, setRoomChangeRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingRequest, setProcessingRequest] = useState(null);
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
            const [dashboardRes, complaintsRes, maintenanceRes, waitingListRes, roomChangeRes] = await Promise.all([
                fetchAdminDashboard(),
                fetchComplaints(),
                fetchMaintenance(),
                fetchWaitingList(),
                fetchRoomChangeRequests()
            ]);

            if (dashboardRes.data.success) {
                setData(dashboardRes.data.data);
            }

            setRecentActivity({
                complaints: complaintsRes.data.success ? complaintsRes.data.data.slice(0, 5) : [],
                maintenance: maintenanceRes.data.success ? maintenanceRes.data.data.slice(0, 5) : [],
                waitingList: waitingListRes.data.success ? waitingListRes.data.data.slice(0, 5) : []
            });

            if (roomChangeRes.data.success) {
                setRoomChangeRequests(roomChangeRes.data.data);
            }
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRoomChange = async (requestId) => {
        try {
            setProcessingRequest(requestId);
            const response = await approveRoomChangeRequest(requestId);
            if (response.data.success) {
                await loadDashboard();
            }
        } catch (err) {
            setError('Failed to approve room change request');
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleDenyRoomChange = async (requestId) => {
        try {
            setProcessingRequest(requestId);
            const response = await denyRoomChangeRequest(requestId);
            if (response.data.success) {
                await loadDashboard();
            }
        } catch (err) {
            setError('Failed to deny room change request');
        } finally {
            setProcessingRequest(null);
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
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
        { label: 'Room Change Requests', value: roomChangeRequests.length || 0 },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Overview of hostel operations</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{kpi.label}</div>
                        <div className="text-4xl font-semibold text-gray-900 dark:text-white">{kpi.value}</div>
                    </div>
                ))}
            </div>

            {data?.today_menu && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Today's Menu</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Breakfast</div>
                            <div className="text-base text-gray-900 dark:text-white">{data.today_menu.breakfast || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Lunch</div>
                            <div className="text-base text-gray-900 dark:text-white">{data.today_menu.lunch || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Snacks</div>
                            <div className="text-base text-gray-900 dark:text-white">{data.today_menu.snacks || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dinner</div>
                            <div className="text-base text-gray-900 dark:text-white">{data.today_menu.dinner || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            )}

            {roomChangeRequests.length > 0 && (
                <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Room Change Requests</h2>
                    <div className="space-y-4">
                        {roomChangeRequests.map((request) => (
                            <div key={request.request_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <h3 className="text-base font-medium text-gray-900 dark:text-white">{request.student_name}</h3>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">({request.student_email})</span>
                                        </div>
                                        <div className="text-base text-gray-600 dark:text-gray-300 mb-3">
                                            <span className="font-medium">Room {request.current_room_number || 'N/A'}</span>
                                            <svg className="w-5 h-5 inline mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span className="font-medium">Room {request.requested_room_number}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="font-medium">Reason:</span> {request.reason}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-500">
                                            Requested on {new Date(request.request_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 ml-6">
                                        <button
                                            onClick={() => handleApproveRoomChange(request.request_id)}
                                            disabled={processingRequest === request.request_id}
                                            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-sm font-medium rounded transition-colors disabled:opacity-50"
                                        >
                                            {processingRequest === request.request_id ? 'Processing...' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleDenyRoomChange(request.request_id)}
                                            disabled={processingRequest === request.request_id}
                                            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium rounded transition-colors disabled:opacity-50"
                                        >
                                            {processingRequest === request.request_id ? 'Processing...' : 'Deny'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-5">Recent Complaints</h3>
                        <div className="space-y-4">
                            {recentActivity.complaints.length > 0 ? (
                                recentActivity.complaints.map((complaint) => (
                                    <div key={complaint.complaint_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{complaint.complaint_type}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{complaint.name}</div>
                                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">Room {complaint.room_number}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">No recent complaints</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-5">Maintenance Requests</h3>
                        <div className="space-y-4">
                            {recentActivity.maintenance.length > 0 ? (
                                recentActivity.maintenance.map((request) => (
                                    <div key={request.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{request.category}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{request.priority} Priority</div>
                                        <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">Room {request.room_id}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">No maintenance requests</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-5">Waiting List</h3>
                        <div className="space-y-4">
                            {recentActivity.waitingList.length > 0 ? (
                                recentActivity.waitingList.map((person) => (
                                    <div key={person.waiting_id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{person.student_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{person.phone}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">No waiting list entries</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
