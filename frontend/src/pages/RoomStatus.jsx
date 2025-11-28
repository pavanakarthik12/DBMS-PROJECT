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

  const getOccupancyStatus = (current, capacity) => {
    if (current === 0) return { text: 'Empty', color: 'green' };
    if (current < capacity) return { text: 'Partially Occupied', color: 'yellow' };
    return { text: 'Full', color: 'red' };
  };

  const getOccupancyColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage === 0) return 'bg-green-500';
    if (percentage < 100) return 'bg-yellow-500';
    return 'bg-red-500';
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

  const totalRooms = rooms.length;
  const emptyRooms = rooms.filter(room => room.current_occupancy === 0).length;
  const fullRooms = rooms.filter(room => room.current_occupancy === room.capacity).length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupied = rooms.reduce((sum, room) => sum + room.current_occupancy, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Room Status</h1>
        <button 
          onClick={fetchRooms}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Refresh
        </button>
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
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
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
              <p className="text-sm font-medium text-gray-600">Empty Rooms</p>
              <p className="text-2xl font-bold text-green-600">{emptyRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Full Rooms</p>
              <p className="text-2xl font-bold text-red-600">{fullRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Occupancy</p>
              <p className="text-2xl font-bold text-purple-600">{overallOccupancy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Room Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Occupancy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => {
                const status = getOccupancyStatus(room.current_occupancy, room.capacity);
                const occupancyRate = Math.round((room.current_occupancy / room.capacity) * 100);
                
                return (
                  <tr key={room.room_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">{room.room_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.capacity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{room.current_occupancy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status.color === 'green' ? 'bg-green-100 text-green-800' :
                        status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {room.students ? (
                        <div className="max-w-xs">
                          {room.students.split(',').map((student, index) => (
                            <div key={index} className="text-sm text-gray-900 mb-1">
                              {student.trim()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No students</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className={`h-2 rounded-full ${getOccupancyColor(room.current_occupancy, room.capacity)}`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{occupancyRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rooms Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const status = getOccupancyStatus(room.current_occupancy, room.capacity);
          const occupancyRate = Math.round((room.current_occupancy / room.capacity) * 100);
          
          return (
            <div key={room.room_id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Room {room.room_number}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  status.color === 'green' ? 'bg-green-100 text-green-800' :
                  status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status.text}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Occupancy:</span>
                  <span className="font-semibold">{room.current_occupancy}/{room.capacity}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getOccupancyColor(room.current_occupancy, room.capacity)}`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">{occupancyRate}%</span>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                </div>

                {room.students && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Current Students:</h4>
                    <div className="space-y-1">
                      {room.students.split(',').map((student, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 text-xs font-medium">
                              {student.trim().charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">{student.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!room.students && (
                  <div className="text-center py-4 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm">Room Available</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatus;