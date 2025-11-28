import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      
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
    total_rooms, 
    occupancy_rate, 
    pending_payments, 
    pending_complaints, 
    waiting_list, 
    today_menu 
  } = dashboardData || {};

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{total_rooms}</div>
          <div className="stat-label">Total Rooms</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{occupancy_rate}%</div>
          <div className="stat-label">Occupancy Rate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{pending_payments}</div>
          <div className="stat-label">Pending Payments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{pending_complaints}</div>
          <div className="stat-label">Pending Complaints</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{waiting_list}</div>
          <div className="stat-label">Waiting List</div>
        </div>
      </div>

      <div className="card-grid">
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
          <h3>Quick Actions</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/payments'}
            >
              Manage Payments
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/complaints'}
            >
              View Complaints
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/waiting-list'}
            >
              Waiting List
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/rooms'}
            >
              Room Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;