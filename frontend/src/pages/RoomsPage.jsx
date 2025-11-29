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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Room Status</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rooms.length} total rooms</p>
                </div>
                <button
                    onClick={loadRooms}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-md transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => {
                    const occupancyPercentage = (room.current_occupancy / room.capacity) * 100;
                    const isFull = room.current_occupancy >= room.capacity;

                    return (
                        <div key={room.room_id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room {room.room_number}</h3>
                                <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${isFull ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    }`}>
                                    {isFull ? 'Full' : 'Available'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Capacity</div>
                                    <div className="text-gray-900 dark:text-white">{room.capacity} students</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Current Occupancy</div>
                                    <div className="text-gray-900 dark:text-white">{room.current_occupancy} / {room.capacity}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Occupancy Rate</div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${isFull ? 'bg-red-600' : 'bg-green-600'}`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {room.students && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Students</div>
                                        <div className="text-gray-900 dark:text-white text-sm">{room.students || 'None'}</div>
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
