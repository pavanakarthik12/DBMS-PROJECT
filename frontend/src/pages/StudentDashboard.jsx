import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getDashboard(user.id);
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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

  const { 
    student, 
    roommates, 
    payment, 
    today_menu, 
    recent_complaints 
  } = dashboardData || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your hostel today</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Room Number</p>
              <p className="text-2xl font-bold text-gray-900">{student?.room_number || 'Not Assigned'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Roommates</p>
              <p className="text-2xl font-bold text-gray-900">{roommates?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${payment?.status === 'Paid' ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${payment?.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Payment Status</p>
              <p className={`text-2xl font-bold ${payment?.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                {payment?.status || 'No Payment'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{recent_complaints?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Room Number:</span>
              <span className="font-semibold">{student?.room_number || 'Not assigned'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-semibold">{student?.capacity || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Join Date:</span>
              <span className="font-semibold">{formatDate(student?.join_date)}</span>
            </div>
            
            {roommates && roommates.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Roommates:</h4>
                <div className="space-y-1">
                  {roommates.map((roommate, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-sm font-medium">
                          {roommate.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700">{roommate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
          
          {payment ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg">₹{payment.amount?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  payment.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Deadline:</span>
                <span className={`font-semibold ${
                  new Date(payment.deadline) < new Date() && payment.status !== 'Paid'
                    ? 'text-red-600' 
                    : 'text-gray-900'
                }`}>
                  {formatDate(payment.deadline)}
                </span>
              </div>
              
              {payment.payment_date && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid On:</span>
                  <span className="font-semibold text-green-600">{formatDate(payment.payment_date)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p>No payment information available</p>
            </div>
          )}
        </div>

        {/* Today's Menu */}
        {today_menu && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Menu</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                {today_menu.day}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-orange-800">🌅 Breakfast</span>
                <span className="text-sm text-gray-600">{today_menu.breakfast}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">🍽️ Lunch</span>
                <span className="text-sm text-gray-600">{today_menu.lunch}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-800">🍪 Snacks</span>
                <span className="text-sm text-gray-600">{today_menu.snacks}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">🌙 Dinner</span>
                <span className="text-sm text-gray-600">{today_menu.dinner}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
            <button 
              onClick={() => window.location.href = '/complaints'}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {recent_complaints && recent_complaints.length > 0 ? (
            <div className="space-y-3">
              {recent_complaints.slice(0, 3).map((complaint) => (
                <div key={complaint.complaint_id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{complaint.complaint_type}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {complaint.description.length > 50 
                          ? complaint.description.substring(0, 50) + '...'
                          : complaint.description
                        }
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      complaint.status === 'Resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(complaint.raised_date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No complaints raised yet</p>
              <button 
                onClick={() => window.location.href = '/complaints'}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
              >
                Raise a complaint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;