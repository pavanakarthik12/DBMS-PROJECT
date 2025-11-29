import React, { useState, useEffect } from 'react';
import { fetchMenu } from '../services/api';

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                setError('Failed to load menu');
            }
        } catch (err) {
            setError('Failed to load menu data');
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMenu = menu.find(m => m.day === today);

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
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Weekly Menu</h1>
                <p className="text-gray-600 dark:text-gray-400">Nutritious meals for the week</p>
            </div>

            {/* Today's Highlight */}
            {todayMenu && (
                <div className="bg-gradient-to-r from-accent to-accent-hover rounded-xl p-8 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Today's Special</h2>
                            <p className="text-white/80">{today}</p>
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm mt-4 md:mt-0">
                            Featured
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Breakfast</div>
                            <div className="font-medium text-lg">{todayMenu.breakfast}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Lunch</div>
                            <div className="font-medium text-lg">{todayMenu.lunch}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Snacks</div>
                            <div className="font-medium text-lg">{todayMenu.snacks}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Dinner</div>
                            <div className="font-medium text-lg">{todayMenu.dinner}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.filter(m => m.day !== today).map((dayMenu) => (
                    <div key={dayMenu.id} className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-accent/50 transition-colors">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{dayMenu.day}</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Breakfast</div>
                                <div className="text-sm text-gray-900 dark:text-white">{dayMenu.breakfast}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Lunch</div>
                                <div className="text-sm text-gray-900 dark:text-white">{dayMenu.lunch}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Snacks</div>
                                <div className="text-sm text-gray-900 dark:text-white">{dayMenu.snacks}</div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Dinner</div>
                                <div className="text-sm text-gray-900 dark:text-white">{dayMenu.dinner}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
