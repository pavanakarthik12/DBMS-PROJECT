import React, { useState, useEffect } from 'react';
import { fetchMaintenanceRequests, createMaintenanceRequest, resolveMaintenanceRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MaintenancePage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({ 
        room_id: user?.room_id || '', 
        category: 'Electrician', 
        description: '',
        priority: 'Medium'
    });
    const [submitting, setSubmitting] = useState(false);

    const demoMaintenanceData = [
        { id: 1, room_id: 101, room_number: '101', category: 'Plumber', description: 'Water leakage in bathroom sink', priority: 'High', status: 'Pending', created_at: '2024-11-25', student_name: 'John Doe' },
        { id: 2, room_id: 102, room_number: '102', category: 'Electrician', description: 'Fan not working properly', priority: 'Medium', status: 'In Progress', created_at: '2024-11-24', student_name: 'Jane Smith' },
        { id: 3, room_id: 103, room_number: '103', category: 'Other', description: 'Door lock needs repair', priority: 'Low', status: 'Completed', created_at: '2024-11-23', student_name: 'Bob Johnson' },
        { id: 4, room_id: 201, room_number: '201', category: 'Plumber', description: 'Shower head replacement needed', priority: 'Medium', status: 'Pending', created_at: '2024-11-22', student_name: 'Alice Brown' },
        { id: 5, room_id: 202, room_number: '202', category: 'Electrician', description: 'Power outlet not functioning', priority: 'High', status: 'Approved', created_at: '2024-11-21', student_name: 'Charlie Wilson' }
    ];

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setRequests(demoMaintenanceData); // Load demo data first
            
            try {
                const response = await fetchMaintenanceRequests();
                if (response.data && response.data.success && response.data.data) {
                    setRequests(response.data.data);
                }
            } catch (err) {
                console.log('Backend maintenance data not available, using demo data');
            }
        } catch (err) {
            console.error('Error loading maintenance requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const requestData = {
                ...newRequest,
                student_id: user?.id,
                room_id: user?.room_id || newRequest.room_id
            };
            
            try {
                const response = await createMaintenanceRequest(requestData);
                if (response.data && response.data.success) {
                    setShowModal(false);
                    setNewRequest({ room_id: user?.room_id || '', category: 'Electrician', description: '', priority: 'Medium' });
                    loadRequests();
                } else {
                    alert(response.data?.message || 'Failed to submit request');
                }
            } catch (err) {
                // Add to demo data for demo purposes
                const newId = Math.max(...requests.map(r => r.id), 0) + 1;
                const newMaintenanceRequest = {
                    id: newId,
                    ...requestData,
                    room_number: requestData.room_id?.toString(),
                    status: 'Pending',
                    created_at: new Date().toISOString().split('T')[0],
                    student_name: user?.name || 'Current User'
                };
                setRequests([newMaintenanceRequest, ...requests]);
                setShowModal(false);
                setNewRequest({ room_id: user?.room_id || '', category: 'Electrician', description: '', priority: 'Medium' });
            }
        } catch (err) {
            console.error('Error submitting request:', err);
            alert('Failed to submit request: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            // Call the backend API to update the status
            const response = await resolveMaintenanceRequest(requestId);
            
            if (response.data && response.data.success) {
                // Update the local state
                setRequests(requests.map(req => 
                    req.id === requestId ? {...req, status: newStatus} : req
                ));
                
                alert(`Request status updated to ${newStatus} successfully!`);
            } else {
                alert(response.data?.message || 'Failed to update request status');
            }
        } catch (err) {
            console.error('Error updating request status:', err);
            alert('Failed to update request status: ' + (err.response?.data?.message || err.message));
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-600 text-white border-red-600';
            case 'Medium': return 'bg-yellow-600 text-white border-yellow-600';
            case 'Low': return 'bg-green-600 text-white border-green-600';
            default: return 'bg-gray-600 text-white border-gray-600';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-600 text-white border-orange-600';
            case 'Approved': return 'bg-blue-600 text-white border-blue-600';
            case 'In Progress': return 'bg-purple-600 text-white border-purple-600';
            case 'Completed': return 'bg-green-600 text-white border-green-600';
            case 'Rejected': return 'bg-red-600 text-white border-red-600';
            default: return 'bg-gray-600 text-white border-gray-600';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Plumber': return '🔧';
            case 'Electrician': return '⚡';
            case 'Cleaner': return '🧽';
            case 'Carpenter': return '🪵';
            case 'Other': return '🔨';
            default: return '🛠️';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Maintenance Requests
                        </h1>
                        <p className="text-2xl text-gray-700 dark:text-gray-300">
                            Manage and track maintenance issues efficiently
                        </p>
                    </div>
                    {user?.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-xl"
                        >
                            + New Request
                        </button>
                    )}
                </div>

                {/* Summary Cards for Admin */}
                {user?.role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {['Pending', 'In Progress', 'Completed', 'Total'].map((status, index) => {
                            const count = status === 'Total' ? requests.length : 
                                         requests.filter(req => req.status === status).length;
                            const colors = [
                                'bg-orange-600',
                                'bg-purple-600',
                                'bg-green-600',
                                'bg-blue-600'
                            ];
                            return (
                                <div key={status} className={`${colors[index]} text-white p-8 rounded-lg`}>
                                    <div>
                                        <p className="text-xl font-medium">{status}</p>
                                        <p className="text-4xl font-bold">{count}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Requests Table */}
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint Title / Problem</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    {user?.role === 'admin' && (
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={user?.role === 'admin' ? 6 : 5} className="px-6 py-16 text-center text-gray-700 dark:text-gray-300">
                                            <h3 className="text-xl font-bold mb-2">No maintenance requests found</h3>
                                            <p>{user?.role === 'student' ? 'Submit your first maintenance request to get started' : 'No requests to review at the moment'}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map(request => (
                                        <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {request.student_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {request.room_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="font-medium">{getCategoryIcon(request.category)} {request.category}</div>
                                                <div className="text-gray-500 dark:text-gray-400 mt-1">{request.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                                                    {request.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(request.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            {user?.role === 'admin' && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {request.status !== 'Completed' && (
                                                        <div className="flex flex-col space-y-2">
                                                            {request.status === 'Pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(request.id, 'Approved')}
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                            {request.status === 'Approved' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Start Work
                                                                </button>
                                                            )}
                                                            {request.status === 'In Progress' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(request.id, 'Completed')}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Mark Complete
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* New Request Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg w-full max-w-lg">
                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                                    New Maintenance Request
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                Room Number
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newRequest.room_id}
                                                onChange={(e) => setNewRequest({...newRequest, room_id: e.target.value})}
                                                className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter your room number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                Category
                                            </label>
                                            <select
                                                required
                                                value={newRequest.category}
                                                onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                                                className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="Electrician">Electrician</option>
                                                <option value="Plumber">Plumber</option>
                                                <option value="Carpenter">Carpenter</option>
                                                <option value="Cleaner">Cleaner</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                Priority
                                            </label>
                                            <select
                                                required
                                                value={newRequest.priority}
                                                onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                                                className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="Low">Low Priority</option>
                                                <option value="Medium">Medium Priority</option>
                                                <option value="High">High Priority</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                Description
                                            </label>
                                            <textarea
                                                required
                                                rows="5"
                                                value={newRequest.description}
                                                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                                                className="w-full px-4 py-3 text-lg rounded-lg border outline-none focus:ring-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
                                                placeholder="Describe the maintenance issue in detail..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-4 text-gray-900 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenancePage;
