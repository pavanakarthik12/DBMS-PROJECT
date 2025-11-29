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
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-6 rounded-lg">
                {error}
            </div>
        );
    }

    const dayMenu = menu.find(item => item.day === selectedDay);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Food Menu</h2>

            <div className="flex flex-wrap gap-4">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedDay === day
                            ? 'bg-accent-blue text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{selectedDay}'s Menu</h3>
                {dayMenu ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border-l-4 border-accent-blue pl-6 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-2">Breakfast</p>
                            <p className="text-gray-900 dark:text-white font-medium text-lg">{dayMenu.breakfast}</p>
                        </div>
                        <div className="border-l-4 border-green-600 pl-6 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-2">Lunch</p>
                            <p className="text-gray-900 dark:text-white font-medium text-lg">{dayMenu.lunch}</p>
                        </div>
                        <div className="border-l-4 border-yellow-600 pl-6 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-2">Snacks</p>
                            <p className="text-gray-900 dark:text-white font-medium text-lg">{dayMenu.snacks}</p>
                        </div>
                        <div className="border-l-4 border-purple-600 pl-6 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-2">Dinner</p>
                            <p className="text-gray-900 dark:text-white font-medium text-lg">{dayMenu.dinner}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No menu items for this day</p>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
