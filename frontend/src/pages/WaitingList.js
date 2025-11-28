import React, { useState, useEffect } from 'react';
import { generalAPI } from '../services/api';

const WaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    student_name: '',
    phone: '',
    join_date: ''
  });

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    try {
      setLoading(true);
      const response = await generalAPI.getWaitingList();
      
      if (response.data.success) {
        setWaitingList(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch waiting list data');
      console.error('Waiting list error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await generalAPI.addToWaitingList(newEntry);
      
      if (response.data.success) {
        setShowForm(false);
        setNewEntry({ student_name: '', phone: '', join_date: '' });
        await fetchWaitingList();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to add to waiting list');
      console.error('Add to waiting list error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getWaitingDays = (joinDate) => {
    const join = new Date(joinDate);
    const today = new Date();
    const diffTime = today - join;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPositionColor = (position) => {
    if (position <= 3) return '#28a745'; // Green for top 3
    if (position <= 6) return '#ffc107'; // Yellow for 4-6
    return '#dc3545'; // Red for 7+
  };

  if (loading) {
    return <div className="loading">Loading waiting list...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const totalWaiting = waitingList.length;
  const avgWaitingTime = totalWaiting > 0 
    ? Math.round(waitingList.reduce((sum, entry) => sum + getWaitingDays(entry.join_date), 0) / totalWaiting)
    : 0;

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Waiting List</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Entry'}
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalWaiting}</div>
          <div className="stat-label">Total Waiting</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{avgWaitingTime}</div>
          <div className="stat-label">Avg. Wait (Days)</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {waitingList.filter(entry => getWaitingDays(entry.join_date) > 30).length}
          </div>
          <div className="stat-label">Waiting {'>'}  30 days</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{color: '#28a745'}}>
            {Math.max(0, 6 - totalWaiting)}
          </div>
          <div className="stat-label">Available Spots</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <h3>Add to Waiting List</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={newEntry.student_name}
                onChange={(e) => setNewEntry({...newEntry, student_name: e.target.value})}
                required
                placeholder="Enter student name"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={newEntry.phone}
                onChange={(e) => setNewEntry({...newEntry, phone: e.target.value})}
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Preferred Join Date</label>
            <input
              type="date"
              value={newEntry.join_date}
              onChange={(e) => setNewEntry({...newEntry, join_date: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Add to Waiting List
          </button>
        </form>
      )}

      <div className="data-table">
        <h3>Waiting List Queue</h3>
        
        {waitingList.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#6c757d'}}>
            <p>No students in waiting list</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add First Entry
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Student Name</th>
                  <th>Phone</th>
                  <th>Preferred Join Date</th>
                  <th>Waiting Since</th>
                  <th>Days Waiting</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {waitingList
                  .sort((a, b) => new Date(a.join_date) - new Date(b.join_date))
                  .map((entry, index) => {
                    const position = index + 1;
                    const waitingDays = getWaitingDays(entry.join_date);
                    
                    return (
                      <tr key={entry.request_id}>
                        <td>
                          <span style={{
                            backgroundColor: getPositionColor(position) + '20',
                            color: getPositionColor(position),
                            padding: '6px 10px',
                            borderRadius: '15px',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            #{position}
                          </span>
                        </td>
                        <td>
                          <strong>{entry.student_name}</strong>
                          {position <= 3 && (
                            <span style={{
                              marginLeft: '8px',
                              fontSize: '12px',
                              color: '#28a745',
                              fontWeight: 'bold'
                            }}>
                              NEXT IN LINE
                            </span>
                          )}
                        </td>
                        <td>{entry.phone}</td>
                        <td>{formatDate(entry.join_date)}</td>
                        <td>{formatDate(entry.join_date)}</td>
                        <td>
                          <span style={{
                            color: waitingDays > 30 ? '#dc3545' : waitingDays > 14 ? '#ffc107' : '#28a745',
                            fontWeight: 'bold'
                          }}>
                            {waitingDays} days
                            {waitingDays > 30 && ' ⚠️'}
                          </span>
                        </td>
                        <td>
                          {position <= 3 && (
                            <span className="status-badge" style={{backgroundColor: '#28a745', color: 'white'}}>
                              High
                            </span>
                          )}
                          {position > 3 && position <= 6 && (
                            <span className="status-badge" style={{backgroundColor: '#ffc107', color: '#212529'}}>
                              Medium
                            </span>
                          )}
                          {position > 6 && (
                            <span className="status-badge" style={{backgroundColor: '#dc3545', color: 'white'}}>
                              Low
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-grid">
        <div className="card">
          <h3>Queue Statistics</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Next 3 in line:</span>
              <span style={{fontWeight: 'bold', color: '#28a745'}}>High Priority</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Positions 4-6:</span>
              <span style={{fontWeight: 'bold', color: '#ffc107'}}>Medium Priority</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Position 7+:</span>
              <span style={{fontWeight: 'bold', color: '#dc3545'}}>Low Priority</span>
            </div>
          </div>
          
          <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e9ecef'}}>
            <p style={{fontSize: '14px', color: '#6c757d', margin: 0}}>
              Students are notified when rooms become available based on their position in the queue.
            </p>
          </div>
        </div>

        <div className="card">
          <h3>Room Availability Forecast</h3>
          <div style={{fontSize: '14px', color: '#6c757d'}}>
            <p style={{marginBottom: '15px'}}>Expected room availability:</p>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>This Week:</span>
              <span style={{color: '#28a745', fontWeight: 'bold'}}>2 rooms</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>This Month:</span>
              <span style={{color: '#ffc107', fontWeight: 'bold'}}>4-5 rooms</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span>Next Month:</span>
              <span style={{color: '#6c757d', fontWeight: 'bold'}}>3-4 rooms</span>
            </div>
            
            <p style={{fontSize: '12px', color: '#6c757d', margin: 0}}>
              * Based on historical data and current occupancy patterns
            </p>
          </div>
        </div>

        <div className="card">
          <h3>Contact Information</h3>
          <div style={{fontSize: '14px', color: '#6c757d', lineHeight: '1.6'}}>
            <p><strong>📞 For Inquiries:</strong></p>
            <p style={{marginLeft: '15px'}}>
              Phone: +91 9876543200<br/>
              Email: admissions@hostel.com
            </p>
            
            <p><strong>🕒 Office Hours:</strong></p>
            <p style={{marginLeft: '15px'}}>
              Monday - Friday: 9:00 AM - 6:00 PM<br/>
              Saturday: 10:00 AM - 4:00 PM
            </p>
            
            <p style={{fontSize: '12px', color: '#6c757d', marginTop: '15px'}}>
              Students will be contacted directly when rooms become available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;