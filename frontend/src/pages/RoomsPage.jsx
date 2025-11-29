import React, { useState, useEffect } from 'react';
import { fetchRooms } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RoomsPage = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
                setError('Failed to load rooms');
            }
        } catch (err) {
            setError('Failed to load rooms data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (room) => {
        const occupancyRate = (room.current_occupancy / room.capacity) * 100;
        if (occupancyRate >= 100) {
            return { label: 'Full', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
        } else if (occupancyRate >= 75) {
            return { label: 'Almost Full', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' };
        } else {
            return { label: 'Available', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' };
        }
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const handleRequestToJoin = async () => {
        alert('Room join request feature will be implemented with backend support');
        setShowModal(false);
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Rooms</h1>
                <p className="text-gray-600 dark:text-gray-400">View all available rooms and their occupancy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => {
                    const status = getStatusInfo(room);
                    return (
                        <div
                            key={room.room_id}
                            onClick={() => handleRoomClick(room)}
                            className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6 cursor-pointer hover:border-accent dark:hover:border-accent transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Room {room.room_number}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{room.room_type}</p>
                                </div>
                                <span className={`px-3 py-1 rounded text-xs font-medium ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Occupancy</span>
                                    <span className="text-base font-medium text-gray-900 dark:text-white">
                                        {room.current_occupancy} / {room.capacity}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-accent h-2 rounded-full transition-all"
                                        style={{ width: `${(room.current_occupancy / room.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && selectedRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Room {selectedRoom.room_number}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedRoom.room_type}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Capacity</div>
                                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRoom.capacity} people</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Occupancy</div>
                                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRoom.current_occupancy} people</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Spots</div>
                                    <div className="text-xl font-semibold text-gray-900 dark:text-white">{selectedRoom.capacity - selectedRoom.current_occupancy} spots</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status</div>
                                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusInfo(selectedRoom).color}`}>
                                        {getStatusInfo(selectedRoom).label}
                                    </span>
                                </div>
                            </div>

                            {selectedRoom.students && selectedRoom.students.length > 0 && (
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Current Residents</h3>
                                    <div className="space-y-2">
                                        {selectedRoom.students.map((student, index) => (
                                            <div key={index} className="flex items-center space-x-3 text-sm text-gray-900 dark:text-white">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{student}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user?.type === 'student' && selectedRoom.capacity > selectedRoom.current_occupancy && (
                                <button
                                    onClick={handleRequestToJoin}
                                    className="w-full px-4 py-3 bg-accent hover:bg-accent-hover text-white text-base font-medium rounded transition-colors"
                                >
                                    Request to Join Room
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
