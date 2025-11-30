import React, { useState, useEffect } from 'react';
import { fetchMaintenanceRequests, createMaintenanceRequest } from '../services/api';
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
            alert('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            setRequests(requests.map(req => 
                req.id === requestId ? {...req, status: newStatus} : req
            ));
            
            // Backend endpoint for updating status not available, using local update
            console.log('Status updated locally - backend endpoint not implemented');
        } catch (err) {
            alert('Failed to update request status');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Maintenance Requests
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Manage and track maintenance issues efficiently
                        </p>
                    </div>
                    {user?.role === 'student' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            + New Request
                        </button>
                    )}
                </div>

                {/* Summary Cards for Admin */}
                {user?.role === 'admin' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {['Pending', 'In Progress', 'Completed', 'Total'].map((status, index) => {
                            const count = status === 'Total' ? requests.length : 
                                         requests.filter(req => req.status === status).length;
                            const colors = [
                                'bg-orange-500 to-orange-600',
                                'bg-purple-500 to-purple-600',
                                'bg-green-500 to-green-600',
                                'bg-blue-500 to-blue-600'
                            ];
                            return (
                                <div key={status} className={`bg-gradient-to-r ${colors[index]} text-white p-6 rounded-xl shadow-lg`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium">{status}</p>
                                            <p className="text-3xl font-bold">{count}</p>
                                        </div>
                                        <div className="text-4xl opacity-80">
                                            {status === 'Total' ? '📊' : 
                                             status === 'Pending' ? '⏳' :
                                             status === 'In Progress' ? '🔄' : '✅'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Requests Grid */}
                <div className="grid gap-6">
                    {requests.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">🛠️</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No maintenance requests found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user?.role === 'student' ? 'Submit your first maintenance request to get started' : 'No requests to review at the moment'}
                            </p>
                        </div>
                    ) : (
                        requests.map(request => (
                            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-3 lg:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-3xl">{getCategoryIcon(request.category)}</div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        Room {request.room_number}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                                        {request.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {request.category} • {request.student_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                                            {request.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center space-x-2">
                                                <span>📅</span>
                                                <span>Submitted: {new Date(request.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}</span>
                                            </span>
                                        </div>
                                        
                                        {user?.role === 'admin' && request.status !== 'Completed' && (
                                            <div className="flex space-x-2">
                                                {request.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'Approved')}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === 'Approved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Start Work
                                                    </button>
                                                )}
                                                {request.status === 'In Progress' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(request.id, 'Completed')}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* New Request Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    New Maintenance Request
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Room Number
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newRequest.room_id}
                                                onChange={(e) => setNewRequest({...newRequest, room_id: e.target.value})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter your room number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Category
                                            </label>
                                            <select
                                                required
                                                value={newRequest.category}
                                                onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="Electrician">⚡ Electrician</option>
                                                <option value="Plumber">🔧 Plumber</option>
                                                <option value="Carpenter">🪵 Carpenter</option>
                                                <option value="Cleaner">🧽 Cleaner</option>
                                                <option value="Other">🔨 Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                required
                                                value={newRequest.priority}
                                                onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="Low">🟢 Low Priority</option>
                                                <option value="Medium">🟡 Medium Priority</option>
                                                <option value="High">🔴 High Priority</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                required
                                                rows="4"
                                                value={newRequest.description}
                                                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                                placeholder="Describe the maintenance issue in detail..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium transition-all"
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
