import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStudent, setUpdatingStudent] = useState(null);

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWaitingList();
      
      if (response.data.success) {
        setWaitingList(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      // If API endpoint doesn't exist, create dummy data
      const dummyWaitingList = [
        {
          waiting_id: 1,
          name: 'Rahul Kumar',
          email: 'rahul.kumar@email.com',
          phone: '+91-9876543210',
          preferred_room_type: 'Single',
          budget: 8000,
          applied_date: '2024-01-05T09:30:00',
          priority: 1,
          status: 'Waiting',
          notes: 'Urgent requirement, starting job next month'
        },
        {
          waiting_id: 2,
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phone: '+91-9876543211',
          preferred_room_type: 'Shared',
          budget: 6000,
          applied_date: '2024-01-06T14:15:00',
          priority: 2,
          status: 'Waiting',
          notes: 'Flexible with roommates, vegetarian food preference'
        },
        {
          waiting_id: 3,
          name: 'Amit Patel',
          email: 'amit.patel@email.com',
          phone: '+91-9876543212',
          preferred_room_type: 'Single',
          budget: 10000,
          applied_date: '2024-01-07T11:20:00',
          priority: 3,
          status: 'Waiting',
          notes: 'Working professional, needs quiet environment'
        },
        {
          waiting_id: 4,
          name: 'Sneha Reddy',
          email: 'sneha.reddy@email.com',
          phone: '+91-9876543213',
          preferred_room_type: 'Shared',
          budget: 5500,
          applied_date: '2024-01-08T16:45:00',
          priority: 4,
          status: 'Contacted',
          notes: 'Student, looking for budget accommodation'
        },
        {
          waiting_id: 5,
          name: 'Vikram Singh',
          email: 'vikram.singh@email.com',
          phone: '+91-9876543214',
          preferred_room_type: 'Single',
          budget: 9000,
          applied_date: '2024-01-09T10:00:00',
          priority: 5,
          status: 'Waiting',
          notes: 'IT professional, prefers AC room'
        },
        {
          waiting_id: 6,
          name: 'Anjali Gupta',
          email: 'anjali.gupta@email.com',
          phone: '+91-9876543215',
          preferred_room_type: 'Shared',
          budget: 7000,
          applied_date: '2024-01-10T13:30:00',
          priority: 6,
          status: 'Allocated',
          notes: 'Allocated to Room 205'
        }
      ];
      setWaitingList(dummyWaitingList);
      console.log('Using dummy waiting list data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (waitingId, status) => {
    try {
      setUpdatingStudent(waitingId);
      // Simulate API call
      setTimeout(() => {
        setWaitingList(list =>
          list.map(student =>
            student.waiting_id === waitingId ? { ...student, status } : student
          )
        );
        setUpdatingStudent(null);
      }, 1000);
    } catch (error) {
      setError('Failed to update status');
      console.error('Update status error:', error);
      setUpdatingStudent(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Allocated':
        return 'bg-green-100 text-green-800';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800';
      case 'Waiting':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRoomTypeIcon = (roomType) => {
    switch (roomType) {
      case 'Single':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'Shared':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalApplicants = waitingList.length;
  const waitingCount = waitingList.filter(s => s.status === 'Waiting').length;
  const contactedCount = waitingList.filter(s => s.status === 'Contacted').length;
  const allocatedCount = waitingList.filter(s => s.status === 'Allocated').length;
  const avgBudget = Math.round(waitingList.reduce((sum, s) => sum + s.budget, 0) / totalApplicants);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Waiting List Management</h1>
        <button 
          onClick={fetchWaitingList}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applicants</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-yellow-600">{waitingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacted</p>
              <p className="text-2xl font-bold text-blue-600">{contactedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Allocated</p>
              <p className="text-2xl font-bold text-green-600">{allocatedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Budget</p>
              <p className="text-2xl font-bold text-purple-600">₹{avgBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Waiting List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Applicant Details (Priority Order)</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Preference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitingList.map((student) => (
                <tr key={student.waiting_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-full">
                        #{student.priority}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoomTypeIcon(student.preferred_room_type)}
                      <span className="text-sm text-gray-900">{student.preferred_room_type}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{student.budget.toLocaleString()}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(student.applied_date)}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {student.status === 'Waiting' && (
                      <button
                        onClick={() => updateStatus(student.waiting_id, 'Contacted')}
                        disabled={updatingStudent === student.waiting_id}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {updatingStudent === student.waiting_id ? 'Updating...' : 'Contact'}
                      </button>
                    )}
                    
                    {student.status === 'Contacted' && (
                      <button
                        onClick={() => updateStatus(student.waiting_id, 'Allocated')}
                        disabled={updatingStudent === student.waiting_id}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {updatingStudent === student.waiting_id ? 'Updating...' : 'Allocate'}
                      </button>
                    )}
                    
                    {student.status === 'Allocated' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium">Allocated</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Individual Notes Section */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Applicant Notes:</h4>
          <div className="space-y-2">
            {waitingList.filter(s => s.notes).map((student) => (
              <div key={student.waiting_id} className="text-sm">
                <span className="font-medium text-gray-900">{student.name}:</span>
                <span className="text-gray-600 ml-2">{student.notes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {waitingList.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No waiting list entries</h3>
          <p className="text-gray-500">All available spots have been filled! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default WaitingList;