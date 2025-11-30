import React, { useState, useEffect } from 'react';
import { fetchMenu } from '../services/api';

const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);

    const demoMenuData = [
        { day: 'Monday', meal_type: 'Breakfast', item_name: 'Aloo Paratha', description: 'Potato stuffed flatbread with yogurt', price: 45 },
        { day: 'Monday', meal_type: 'Lunch', item_name: 'Dal Rice', description: 'Lentils with steamed basmati rice', price: 65 },
        { day: 'Monday', meal_type: 'Snacks', item_name: 'Samosa', description: 'Crispy triangular pastry with spiced filling', price: 25 },
        { day: 'Monday', meal_type: 'Dinner', item_name: 'Paneer Curry', description: 'Cottage cheese in rich tomato gravy', price: 85 },
        { day: 'Tuesday', meal_type: 'Breakfast', item_name: 'Idli Sambhar', description: 'Steamed rice cakes with lentil curry', price: 40 },
        { day: 'Tuesday', meal_type: 'Lunch', item_name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread', price: 75 },
        { day: 'Tuesday', meal_type: 'Snacks', item_name: 'Pakora', description: 'Deep fried vegetable fritters', price: 30 },
        { day: 'Tuesday', meal_type: 'Dinner', item_name: 'Chicken Curry', description: 'Spicy chicken curry with rice', price: 95 },
        { day: 'Wednesday', meal_type: 'Breakfast', item_name: 'Poha', description: 'Flattened rice with vegetables and spices', price: 35 },
        { day: 'Wednesday', meal_type: 'Lunch', item_name: 'Rajma Rice', description: 'Kidney beans curry with rice', price: 70 },
        { day: 'Wednesday', meal_type: 'Snacks', item_name: 'Bhel Puri', description: 'Puffed rice snack with chutneys', price: 35 },
        { day: 'Wednesday', meal_type: 'Dinner', item_name: 'Fish Curry', description: 'Fresh fish in coconut curry', price: 90 },
        { day: 'Thursday', meal_type: 'Breakfast', item_name: 'Upma', description: 'Semolina porridge with vegetables', price: 30 },
        { day: 'Thursday', meal_type: 'Lunch', item_name: 'Biryani', description: 'Fragrant rice with spiced vegetables', price: 80 },
        { day: 'Thursday', meal_type: 'Snacks', item_name: 'Vada Pav', description: 'Spiced potato fritter in bread roll', price: 20 },
        { day: 'Thursday', meal_type: 'Dinner', item_name: 'Mutton Curry', description: 'Tender mutton in aromatic spices', price: 110 },
        { day: 'Friday', meal_type: 'Breakfast', item_name: 'Dosa', description: 'Crispy crepe with coconut chutney', price: 50 },
        { day: 'Friday', meal_type: 'Lunch', item_name: 'Pulao', description: 'Spiced rice with mixed vegetables', price: 60 },
        { day: 'Friday', meal_type: 'Snacks', item_name: 'Chaat', description: 'Tangy street food with crispy elements', price: 40 },
        { day: 'Friday', meal_type: 'Dinner', item_name: 'Prawn Curry', description: 'Juicy prawns in spicy coconut sauce', price: 100 },
        { day: 'Saturday', meal_type: 'Breakfast', item_name: 'Puri Sabji', description: 'Fried bread with spiced potato curry', price: 45 },
        { day: 'Saturday', meal_type: 'Lunch', item_name: 'Thali', description: 'Complete meal with variety of dishes', price: 90 },
        { day: 'Saturday', meal_type: 'Snacks', item_name: 'Dhokla', description: 'Steamed savory cake with chutneys', price: 35 },
        { day: 'Saturday', meal_type: 'Dinner', item_name: 'Lamb Biryani', description: 'Aromatic rice with tender lamb pieces', price: 120 },
        { day: 'Sunday', meal_type: 'Breakfast', item_name: 'Paratha', description: 'Layered flatbread with pickle and curd', price: 40 },
        { day: 'Sunday', meal_type: 'Lunch', item_name: 'South Indian Thali', description: 'Traditional South Indian complete meal', price: 85 },
        { day: 'Sunday', meal_type: 'Snacks', item_name: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', price: 55 },
        { day: 'Sunday', meal_type: 'Dinner', item_name: 'Special Curry', description: 'Chef special mixed vegetable curry', price: 75 }
    ];

    useEffect(() => {
        loadMenuData();
    }, []);

    const loadMenuData = async () => {
        try {
            setLoading(true);
            setMenuData(demoMenuData); // Load demo data first
            
            try {
                const response = await fetchMenu();
                if (response.data && response.data.success && response.data.data) {
                    setMenuData(response.data.data);
                }
            } catch (err) {
                console.log('Backend menu not available, using demo data');
            }
        } catch (err) {
            console.error('Error loading menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMenu = menuData.filter(item => item.day === today);
    const weeklyMenu = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
        day,
        meals: menuData.filter(item => item.day === day)
    }));

    const getMealsByType = (meals, type) => meals.filter(meal => meal.meal_type === type);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8">
            {/* Today's Menu Highlight */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Today's Menu - {today}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealType => {
                        const meal = getMealsByType(todayMenu, mealType)[0];
                        return (
                            <div key={mealType} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{mealType}</h3>
                                {meal ? (
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{meal.item_name}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{meal.description}</p>
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{meal.price}</div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-500 text-base">No menu available</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Weekly Menu Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Weekly Menu Plan</h2>
                
                <div className="space-y-8">
                    {weeklyMenu.map(({ day, meals }) => (
                        <div key={day} className="border-b border-gray-200 dark:border-gray-600 pb-8 last:border-b-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{day}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(mealType => {
                                    const meal = getMealsByType(meals, mealType)[0];
                                    return (
                                        <div key={mealType} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
                                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{mealType}</div>
                                            {meal ? (
                                                <div className="space-y-2">
                                                    <div className="font-medium text-gray-900 dark:text-white">{meal.item_name}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{meal.description}</div>
                                                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">₹{meal.price}</div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 dark:text-gray-500 text-sm">Not available</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Weekly Menu Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="mb-8">
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
                {menuData.filter(m => m.day !== today).map((dayMenu) => (
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
        </div>
    );
};

export default MenuPage;
