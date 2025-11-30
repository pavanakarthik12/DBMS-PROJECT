import React, { useState, useEffect } from 'react';
import { fetchMenu } from '../services/api';
import jsPDF from 'jspdf';

const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        loadMenuData();
    }, []);

    const loadMenuData = async () => {
        try {
            setLoading(true);
            const response = await fetchMenu();
            if (response.data && response.data.success && response.data.data) {
                setMenuData(response.data.data);
            }
        } catch (err) {
            console.error('Error loading menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const downloadMenuPDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date();
        const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        // Header
        doc.setFontSize(20);
        doc.text('University Hostel', 20, 20);
        doc.setFontSize(16);
        doc.text('Weekly Menu', 20, 35);
        doc.setFontSize(12);
        doc.text(`Week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`, 20, 50);
        
        let yPosition = 70;
        
        // Group menu data by day
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        dayOrder.forEach(day => {
            const dayMeals = menuData.filter(item => item.day === day);
            
            if (dayMeals.length > 0) {
                // Day header
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(day, 20, yPosition);
                yPosition += 15;
                
                // Meals for the day
                ['Breakfast', 'Lunch', 'Snacks', 'Dinner'].forEach(mealType => {
                    const meal = dayMeals.find(m => m.meal_type === mealType);
                    if (meal) {
                        doc.setFontSize(11);
                        doc.setFont(undefined, 'bold');
                        doc.text(`${mealType}:`, 25, yPosition);
                        doc.setFont(undefined, 'normal');
                        
                        // Split long text
                        const splitText = doc.splitTextToSize(meal.item_name, 160);
                        doc.text(splitText, 65, yPosition);
                        yPosition += splitText.length * 5 + 2;
                    }
                });
                
                yPosition += 10;
                
                // Add new page if needed
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
            }
        });
        
        doc.save('Hostel_Menu.pdf');
    };

    const getMealsByDay = (day) => {
        return menuData.filter(item => item.day === day);
    };

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getTodayMenu = () => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        return menuData.filter(item => item.day === today);
    };

    const todayMenu = getTodayMenu();

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hostel Menu</h1>
                        <p className="text-gray-600 dark:text-gray-400">The menu changes every 2 weeks</p>
                    </div>
                    <button
                        onClick={downloadMenuPDF}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Download Menu (PDF)
                    </button>
                </div>

                {/* Today's Menu */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Today's Menu - {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealType => {
                            const meal = todayMenu.find(m => m.meal_type === mealType);
                            return (
                                <div key={mealType} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{mealType}</h3>
                                    {meal ? (
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                                                {meal.item_name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {meal.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500">Not available</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weekly Menu */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weekly Menu</h2>
                    <div className="space-y-6">
                        {dayOrder.map(day => {
                            const meals = getMealsByDay(day);
                            return (
                                <div key={day} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{day}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealType => {
                                            const meal = meals.find(m => m.meal_type === mealType);
                                            return (
                                                <div key={mealType} className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{mealType}</div>
                                                    {meal ? (
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                                {meal.item_name}
                                                            </div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                {meal.description}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-500">Not available</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
