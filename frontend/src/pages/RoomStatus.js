import React, { useState, useEffect } from 'react';
import { generalAPI } from '../services/api';

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await generalAPI.getRooms();
      
      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch rooms data');
      console.error('Rooms error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const getOccupancyStatus = (current, capacity) => {
    if (current === 0) return { text: 'Empty', class: 'status-available' };
    if (current < capacity) return { text: 'Partially Occupied', class: 'status-partial' };
    return { text: 'Full', class: 'status-full' };
  };

  const getOccupancyColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage === 0) return '#28a745'; // Green for empty
    if (percentage < 100) return '#ffc107'; // Yellow for partial
    return '#dc3545'; // Red for full
  };

  return (
    <div className="dashboard">
      <h1>Room Status</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{rooms.length}</div>
          <div className="stat-label">Total Rooms</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {rooms.filter(room => room.current_occupancy === 0).length}
          </div>
          <div className="stat-label">Empty Rooms</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {rooms.filter(room => room.current_occupancy === room.capacity).length}
          </div>
          <div className="stat-label">Full Rooms</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {Math.round(
              (rooms.reduce((sum, room) => sum + room.current_occupancy, 0) /
               rooms.reduce((sum, room) => sum + room.capacity, 0)) * 100
            )}%
          </div>
          <div className="stat-label">Overall Occupancy</div>
        </div>
      </div>

      <div className="data-table">
        <h3>Room Details</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Capacity</th>
                <th>Current Occupancy</th>
                <th>Status</th>
                <th>Students</th>
                <th>Occupancy Rate</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const status = getOccupancyStatus(room.current_occupancy, room.capacity);
                const occupancyRate = Math.round((room.current_occupancy / room.capacity) * 100);
                
                return (
                  <tr key={room.room_id}>
                    <td>
                      <strong style={{fontSize: '16px'}}>{room.room_number}</strong>
                    </td>
                    <td>{room.capacity}</td>
                    <td>
                      <span style={{
                        color: getOccupancyColor(room.current_occupancy, room.capacity),
                        fontWeight: 'bold'
                      }}>
                        {room.current_occupancy}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{
                          backgroundColor: getOccupancyColor(room.current_occupancy, room.capacity) + '20',
                          color: getOccupancyColor(room.current_occupancy, room.capacity),
                          border: `1px solid ${getOccupancyColor(room.current_occupancy, room.capacity)}`
                        }}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td>
                      {room.students ? (
                        <div style={{fontSize: '14px'}}>
                          {room.students.split(',').map((student, index) => (
                            <div key={index} style={{marginBottom: '2px'}}>
                              {student.trim()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{color: '#6c757d', fontStyle: 'italic'}}>No students</span>
                      )}
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div 
                          style={{
                            width: '80px',
                            height: '8px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            style={{
                              width: `${occupancyRate}%`,
                              height: '100%',
                              backgroundColor: getOccupancyColor(room.current_occupancy, room.capacity),
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                        <span style={{fontSize: '14px', fontWeight: 'bold'}}>
                          {occupancyRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-grid">
        {rooms.map((room) => {
          const status = getOccupancyStatus(room.current_occupancy, room.capacity);
          const occupancyRate = Math.round((room.current_occupancy / room.capacity) * 100);
          
          return (
            <div key={room.room_id} className="card">
              <h3>Room {room.room_number}</h3>
              
              <div style={{marginBottom: '15px'}}>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span>Occupancy:</span>
                  <span style={{fontWeight: 'bold'}}>
                    {room.current_occupancy}/{room.capacity}
                  </span>
                </div>
                
                <div 
                  style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${occupancyRate}%`,
                      height: '100%',
                      backgroundColor: getOccupancyColor(room.current_occupancy, room.capacity),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <span 
                  className="status-badge"
                  style={{
                    backgroundColor: getOccupancyColor(room.current_occupancy, room.capacity) + '20',
                    color: getOccupancyColor(room.current_occupancy, room.capacity),
                    border: `1px solid ${getOccupancyColor(room.current_occupancy, room.capacity)}`
                  }}
                >
                  {status.text}
                </span>
              </div>

              {room.students && (
                <div>
                  <h4 style={{marginBottom: '10px', fontSize: '16px'}}>Current Students:</h4>
                  <ul style={{paddingLeft: '20px', margin: '0'}}>
                    {room.students.split(',').map((student, index) => (
                      <li key={index} style={{marginBottom: '5px'}}>
                        {student.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatus;