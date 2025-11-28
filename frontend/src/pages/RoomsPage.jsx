import React, { useState, useEffect } from 'react';
import { fetchRooms } from '../services/api';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            setLoading(true);
            const response = await fetchRooms();
            if (response.data.success) {
                setRooms(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Room Status</h2>
                <button
                    onClick={loadRooms}
                    className="px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => {
                    const occupancyPercentage = (room.current_occupancy / room.capacity) * 100;
                    const isFull = room.current_occupancy >= room.capacity;

                    return (
                        <div key={room.room_id} className="bg-surface-dark border border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Room {room.room_number}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                    }`}>
                                    {isFull ? 'Full' : 'Available'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-400">Capacity</p>
                                    <p className="text-white">{room.capacity} students</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Current Occupancy</p>
                                    <p className="text-white">{room.current_occupancy} / {room.capacity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Occupancy Rate</p>
                                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full ${isFull ? 'bg-red-600' : 'bg-green-600'}`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {room.students && (
                                    <div>
                                        <p className="text-sm text-gray-400">Students</p>
                                        <p className="text-white text-sm">{room.students || 'None'}</p>
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

export default RoomsPage;
