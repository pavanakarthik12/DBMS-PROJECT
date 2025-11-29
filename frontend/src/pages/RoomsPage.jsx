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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Room Status</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{rooms.length} total rooms</p>
                </div>
                <button
                    onClick={loadRooms}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room) => {
                    const occupancyPercentage = (room.current_occupancy / room.capacity) * 100;
                    const isFull = room.current_occupancy >= room.capacity;

                    return (
                        <div key={room.room_id} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Room {room.room_number}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${isFull ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    }`}>
                                    {isFull ? 'Full' : 'Available'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Capacity</div>
                                    <div className="text-sm text-gray-900 dark:text-white">{room.capacity} students</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Current Occupancy</div>
                                    <div className="text-sm text-gray-900 dark:text-white">{room.current_occupancy} / {room.capacity}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Occupancy Rate</div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full ${isFull ? 'bg-red-600' : 'bg-green-600'}`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {room.students && (
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Students</div>
                                        <div className="text-xs text-gray-900 dark:text-white">{room.students || 'None'}</div>
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
