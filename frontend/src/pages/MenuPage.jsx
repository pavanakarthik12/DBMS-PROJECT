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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
                {error}
            </div>
        );
    }

    const dayMenu = menu.find(item => item.day === selectedDay);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Food Menu</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weekly meal schedule</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedDay === day
                            ? 'bg-accent-blue text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{selectedDay}'s Menu</h3>
                {dayMenu ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Breakfast</div>
                            <div className="text-gray-900 dark:text-white">{dayMenu.breakfast}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Lunch</div>
                            <div className="text-gray-900 dark:text-white">{dayMenu.lunch}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Snacks</div>
                            <div className="text-gray-900 dark:text-white">{dayMenu.snacks}</div>
                        </div>
                        <div>
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Dinner</div>
                            <div className="text-gray-900 dark:text-white">{dayMenu.dinner}</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No menu items for this day</p>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
