import React, { useState, useEffect } from 'react';
import { adminAPI, studentAPI } from '../services/api';
import { useAuth } from '../components/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [updatingComplaint, setUpdatingComplaint] = useState(null);
  
  const [newComplaint, setNewComplaint] = useState({
    complaint_type: '',
    description: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user.type === 'admin') {
        response = await adminAPI.getComplaints();
      } else {
        response = await studentAPI.getComplaints(user.id);
      }
      
      if (response.data.success) {
        setComplaints(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch complaints data');
      console.error('Complaints error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    try {
      const complaintData = {
        ...newComplaint,
        student_id: user.id,
        room_id: user.room_id
      };
      
      const response = await studentAPI.createComplaint(complaintData);
      
      if (response.data.success) {
        setShowForm(false);
        setNewComplaint({ complaint_type: '', description: '' });
        await fetchComplaints();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to submit complaint');
      console.error('Submit complaint error:', error);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      setUpdatingComplaint(complaintId);
      const response = await adminAPI.updateComplaint(complaintId, { status });
      
      if (response.data.success) {
        await fetchComplaints();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to update complaint');
      console.error('Update complaint error:', error);
    } finally {
      setUpdatingComplaint(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    return status === 'Resolved' ? '#28a745' : '#ffc107';
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;

  const complaintTypes = [...new Set(complaints.map(c => c.complaint_type))];
  const complaintsByType = complaintTypes.map(type => ({
    type,
    count: complaints.filter(c => c.complaint_type === type).length
  }));

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>{user.type === 'admin' ? 'Complaint Management' : 'My Complaints'}</h1>
        {user.type === 'student' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Raise New Complaint'}
          </button>
        )}
      </div>
      
      {user.type === 'admin' && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalComplaints}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number" style={{color: '#ffc107'}}>{pendingComplaints}</div>
            <div className="stat-label">Pending</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number" style={{color: '#28a745'}}>{resolvedComplaints}</div>
            <div className="stat-label">Resolved</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">
              {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0}%
            </div>
            <div className="stat-label">Resolution Rate</div>
          </div>
        </div>
      )}

      {user.type === 'student' && showForm && (
        <form onSubmit={handleSubmitComplaint} className="form">
          <h3>Raise New Complaint</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Complaint Type</label>
              <select
                value={newComplaint.complaint_type}
                onChange={(e) => setNewComplaint({...newComplaint, complaint_type: e.target.value})}
                required
              >
                <option value="">Select complaint type</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="cleaning">Cleaning</option>
                <option value="broken furniture">Broken Furniture</option>
                <option value="WiFi issue">WiFi Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
              required
              rows="4"
              placeholder="Please provide detailed description of the issue..."
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Submit Complaint
          </button>
        </form>
      )}

      <div className="data-table">
        <h3>
          {user.type === 'admin' ? 'All Complaints' : 'Your Complaints'}
          {user.type === 'student' && (
            <span style={{fontSize: '16px', color: '#6c757d', fontWeight: 'normal'}}>
              ({complaints.length} total)
            </span>
          )}
        </h3>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {user.type === 'admin' && <th>Student</th>}
                <th>Room</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date Raised</th>
                {user.type === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.complaint_id}>
                  {user.type === 'admin' && (
                    <td>
                      <strong>{complaint.name}</strong>
                    </td>
                  )}
                  <td>{complaint.room_number || 'No room'}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {complaint.complaint_type}
                    </span>
                  </td>
                  <td>
                    <div style={{maxWidth: '300px'}}>
                      {complaint.description.length > 100 
                        ? complaint.description.substring(0, 100) + '...'
                        : complaint.description
                      }
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(complaint.status) + '20',
                        color: getStatusColor(complaint.status),
                        border: `1px solid ${getStatusColor(complaint.status)}`
                      }}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td>{formatDate(complaint.raised_date)}</td>
                  {user.type === 'admin' && (
                    <td>
                      {complaint.status === 'Pending' ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateComplaintStatus(complaint.complaint_id, 'Resolved')}
                          disabled={updatingComplaint === complaint.complaint_id}
                        >
                          {updatingComplaint === complaint.complaint_id ? 'Updating...' : 'Mark Resolved'}
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => updateComplaintStatus(complaint.complaint_id, 'Pending')}
                          disabled={updatingComplaint === complaint.complaint_id}
                        >
                          {updatingComplaint === complaint.complaint_id ? 'Updating...' : 'Reopen'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {complaints.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#6c757d'}}>
            <p>No complaints found</p>
            {user.type === 'student' && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Raise Your First Complaint
              </button>
            )}
          </div>
        )}
      </div>

      {user.type === 'admin' && complaintsByType.length > 0 && (
        <div className="card-grid">
          <div className="card">
            <h3>Complaints by Type</h3>
            {complaintsByType.map(({ type, count }) => (
              <div key={type} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '8px 0',
                borderBottom: '1px solid #e9ecef'
              }}>
                <span style={{textTransform: 'capitalize'}}>{type}</span>
                <span style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Resolution Progress</h3>
            <div style={{marginBottom: '15px'}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span>Progress:</span>
                <span style={{fontWeight: 'bold'}}>
                  {resolvedComplaints}/{totalComplaints}
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e9ecef',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#28a745',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            
            <div style={{fontSize: '14px', color: '#6c757d'}}>
              <p>Pending: {pendingComplaints}</p>
              <p>Average resolution time: ~2 days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;