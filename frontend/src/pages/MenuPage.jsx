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

    const dayMenu = menu.find(item => item.day === selectedDay);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Food Menu</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Weekly meal schedule</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${selectedDay === day
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{selectedDay}'s Menu</h3>
                {dayMenu ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Breakfast</div>
                            <div className="text-sm text-gray-900 dark:text-white">{dayMenu.breakfast}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lunch</div>
                            <div className="text-sm text-gray-900 dark:text-white">{dayMenu.lunch}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Snacks</div>
                            <div className="text-sm text-gray-900 dark:text-white">{dayMenu.snacks}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dinner</div>
                            <div className="text-sm text-gray-900 dark:text-white">{dayMenu.dinner}</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No menu items for this day</p>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
