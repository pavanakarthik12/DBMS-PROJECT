import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { useAuth } from '../components/AuthContext';

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

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const { 
    student, 
    roommates, 
    payment, 
    today_menu, 
    recent_complaints 
  } = dashboardData || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {student?.name}!</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{student?.room_number || 'Not Assigned'}</div>
          <div className="stat-label">Room Number</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{roommates?.length || 0}</div>
          <div className="stat-label">Roommates</div>
        </div>
        
        <div className="stat-card">
          <div className={`stat-number ${payment?.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>
            {payment?.status || 'No Payment'}
          </div>
          <div className="stat-label">Payment Status</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{recent_complaints?.length || 0}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Room Information</h3>
          <p><strong>Room:</strong> {student?.room_number || 'Not assigned'}</p>
          <p><strong>Capacity:</strong> {student?.capacity || 'N/A'}</p>
          <p><strong>Join Date:</strong> {formatDate(student?.join_date)}</p>
          
          {roommates && roommates.length > 0 && (
            <>
              <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Roommates:</h4>
              <ul style={{paddingLeft: '20px'}}>
                {roommates.map((roommate, index) => (
                  <li key={index}>{roommate}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="card">
          <h3>Payment Information</h3>
          {payment ? (
            <>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${payment.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>
                  {payment.status}
                </span>
              </p>
              <p><strong>Deadline:</strong> {formatDate(payment.deadline)}</p>
              {payment.payment_date && (
                <p><strong>Paid On:</strong> {formatDate(payment.payment_date)}</p>
              )}
            </>
          ) : (
            <p>No payment information available</p>
          )}
        </div>

        {today_menu && (
          <div className="card">
            <h3>Today's Menu ({today_menu.day})</h3>
            <div className="menu-item">
              <div className="menu-item-label">Breakfast</div>
              <div className="menu-item-content">{today_menu.breakfast}</div>
            </div>
            <div className="menu-item">
              <div className="menu-item-label">Lunch</div>
              <div className="menu-item-content">{today_menu.lunch}</div>
            </div>
            <div className="menu-item">
              <div className="menu-item-label">Snacks</div>
              <div className="menu-item-content">{today_menu.snacks}</div>
            </div>
            <div className="menu-item">
              <div className="menu-item-label">Dinner</div>
              <div className="menu-item-content">{today_menu.dinner}</div>
            </div>
          </div>
        )}

        <div className="card">
          <h3>Recent Complaints</h3>
          {recent_complaints && recent_complaints.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_complaints.slice(0, 3).map((complaint) => (
                    <tr key={complaint.complaint_id}>
                      <td>{complaint.complaint_type}</td>
                      <td>
                        <span className={`status-badge ${complaint.status === 'Resolved' ? 'status-resolved' : 'status-pending'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{formatDate(complaint.raised_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No complaints raised yet</p>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/complaints'}
            style={{marginTop: '15px'}}
          >
            View All Complaints
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;