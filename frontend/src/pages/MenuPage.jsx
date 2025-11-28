import React, { useState, useEffect } from 'react';
import { fetchMenu } from '../services/api';

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            setLoading(true);
            const response = await fetchMenu();
            if (response.data.success) {
                setMenu(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to load menu');
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

    const dayMenu = menu.filter(item => item.day === selectedDay);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Food Menu</h2>

            <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedDay === day
                                ? 'bg-accent-blue text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="bg-surface-dark border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{selectedDay}'s Menu</h3>
                {dayMenu.length > 0 ? (
                    <div className="space-y-4">
                        {dayMenu.map((item) => (
                            <div key={item.menu_id} className="border-l-4 border-accent-blue pl-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400 uppercase">{item.meal_type}</p>
                                        <p className="text-white font-medium">{item.item_name}</p>
                                        {item.description && (
                                            <p className="text-sm text-gray-400">{item.description}</p>
                                        )}
                                    </div>
                                    {item.price && (
                                        <p className="text-white font-semibold">₹{item.price}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No menu items for this day</p>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
