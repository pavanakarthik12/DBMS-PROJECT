import React, { useState, useEffect } from 'react';
import { generalAPI } from '../services/api';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await generalAPI.getMenu();
      
      if (response.data.success) {
        setMenu(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      // If API endpoint doesn't exist, create dummy data
      const dummyMenu = [
        // Monday
        { id: 1, day: 'Monday', meal_type: 'Breakfast', item_name: 'Aloo Paratha', description: 'Stuffed potato flatbread with yogurt and pickle', price: 45 },
        { id: 2, day: 'Monday', meal_type: 'Breakfast', item_name: 'Masala Tea', description: 'Spiced Indian tea', price: 15 },
        { id: 3, day: 'Monday', meal_type: 'Lunch', item_name: 'Dal Tadka', description: 'Seasoned yellow lentils with rice', price: 65 },
        { id: 4, day: 'Monday', meal_type: 'Lunch', item_name: 'Chapati (2 pcs)', description: 'Indian flatbread', price: 20 },
        { id: 5, day: 'Monday', meal_type: 'Dinner', item_name: 'Paneer Curry', description: 'Cottage cheese curry with rice', price: 85 },
        { id: 6, day: 'Monday', meal_type: 'Dinner', item_name: 'Mixed Vegetable', description: 'Seasonal vegetables curry', price: 55 },
        
        // Tuesday
        { id: 7, day: 'Tuesday', meal_type: 'Breakfast', item_name: 'Idli Sambhar', description: 'Steamed rice cakes with lentil curry', price: 40 },
        { id: 8, day: 'Tuesday', meal_type: 'Breakfast', item_name: 'Coffee', description: 'South Indian filter coffee', price: 20 },
        { id: 9, day: 'Tuesday', meal_type: 'Lunch', item_name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread', price: 75 },
        { id: 10, day: 'Tuesday', meal_type: 'Lunch', item_name: 'Pickle & Onion', description: 'Traditional accompaniments', price: 10 },
        { id: 11, day: 'Tuesday', meal_type: 'Dinner', item_name: 'Chicken Curry', description: 'Spicy chicken curry with rice', price: 95 },
        { id: 12, day: 'Tuesday', meal_type: 'Dinner', item_name: 'Raita', description: 'Yogurt with cucumber and spices', price: 25 },
        
        // Wednesday
        { id: 13, day: 'Wednesday', meal_type: 'Breakfast', item_name: 'Poha', description: 'Flattened rice with vegetables and peanuts', price: 35 },
        { id: 14, day: 'Wednesday', meal_type: 'Breakfast', item_name: 'Masala Tea', description: 'Spiced Indian tea', price: 15 },
        { id: 15, day: 'Wednesday', meal_type: 'Lunch', item_name: 'Rajma Rice', description: 'Kidney beans curry with basmati rice', price: 70 },
        { id: 16, day: 'Wednesday', meal_type: 'Lunch', item_name: 'Papad', description: 'Crispy lentil wafer', price: 8 },
        { id: 17, day: 'Wednesday', meal_type: 'Dinner', item_name: 'Mutton Curry', description: 'Tender mutton curry with bread', price: 110 },
        { id: 18, day: 'Wednesday', meal_type: 'Dinner', item_name: 'Jeera Rice', description: 'Cumin flavored rice', price: 45 },
        
        // Thursday
        { id: 19, day: 'Thursday', meal_type: 'Breakfast', item_name: 'Upma', description: 'Semolina cooked with vegetables', price: 30 },
        { id: 20, day: 'Thursday', meal_type: 'Breakfast', item_name: 'Coconut Chutney', description: 'Fresh coconut chutney', price: 15 },
        { id: 21, day: 'Thursday', meal_type: 'Lunch', item_name: 'Sambar Rice', description: 'South Indian lentil curry with rice', price: 60 },
        { id: 22, day: 'Thursday', meal_type: 'Lunch', item_name: 'Vegetable Curry', description: 'Mixed seasonal vegetables', price: 50 },
        { id: 23, day: 'Thursday', meal_type: 'Dinner', item_name: 'Fish Curry', description: 'Bengali style fish curry', price: 90 },
        { id: 24, day: 'Thursday', meal_type: 'Dinner', item_name: 'Plain Rice', description: 'Steamed basmati rice', price: 35 },
        
        // Friday
        { id: 25, day: 'Friday', meal_type: 'Breakfast', item_name: 'Paratha', description: 'Layered flatbread with butter', price: 40 },
        { id: 26, day: 'Friday', meal_type: 'Breakfast', item_name: 'Curd', description: 'Fresh yogurt', price: 20 },
        { id: 27, day: 'Friday', meal_type: 'Lunch', item_name: 'Biryani', description: 'Aromatic rice with vegetables/chicken', price: 95 },
        { id: 28, day: 'Friday', meal_type: 'Lunch', item_name: 'Boiled Egg', description: 'Hard boiled eggs (2 pcs)', price: 30 },
        { id: 29, day: 'Friday', meal_type: 'Dinner', item_name: 'Kadhi Chawal', description: 'Yogurt curry with rice', price: 65 },
        { id: 30, day: 'Friday', meal_type: 'Dinner', item_name: 'Achar', description: 'Mixed vegetable pickle', price: 12 },
        
        // Saturday
        { id: 31, day: 'Saturday', meal_type: 'Breakfast', item_name: 'Dosa', description: 'Crispy rice crepe with sambhar', price: 50 },
        { id: 32, day: 'Saturday', meal_type: 'Breakfast', item_name: 'Coffee', description: 'South Indian filter coffee', price: 20 },
        { id: 33, day: 'Saturday', meal_type: 'Lunch', item_name: 'Pav Bhaji', description: 'Spiced vegetable mash with bread rolls', price: 65 },
        { id: 34, day: 'Saturday', meal_type: 'Lunch', item_name: 'Butter', description: 'Extra butter for pav', price: 15 },
        { id: 35, day: 'Saturday', meal_type: 'Dinner', item_name: 'Special Thali', description: 'Complete meal with multiple dishes', price: 120 },
        { id: 36, day: 'Saturday', meal_type: 'Dinner', item_name: 'Sweet', description: 'Traditional Indian dessert', price: 35 },
        
        // Sunday
        { id: 37, day: 'Sunday', meal_type: 'Breakfast', item_name: 'Stuffed Paratha', description: 'Paratha with aloo/paneer filling', price: 55 },
        { id: 38, day: 'Sunday', meal_type: 'Breakfast', item_name: 'Lassi', description: 'Sweet/salty yogurt drink', price: 25 },
        { id: 39, day: 'Sunday', meal_type: 'Lunch', item_name: 'Special Chicken', description: 'Sunday special chicken preparation', price: 105 },
        { id: 40, day: 'Sunday', meal_type: 'Lunch', item_name: 'Naan', description: 'Leavened bread from tandoor', price: 25 },
        { id: 41, day: 'Sunday', meal_type: 'Dinner', item_name: 'Pulao', description: 'Fragrant rice with spices', price: 75 },
        { id: 42, day: 'Sunday', meal_type: 'Dinner', item_name: 'Kheer', description: 'Rice pudding dessert', price: 40 },
      ];
      setMenu(dummyMenu);
      console.log('Using dummy menu data');
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'Breakfast':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'Lunch':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        );
      case 'Dinner':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const currentDayMenu = menu.filter(item => item.day === selectedDay);
  const breakfastItems = currentDayMenu.filter(item => item.meal_type === 'Breakfast');
  const lunchItems = currentDayMenu.filter(item => item.meal_type === 'Lunch');
  const dinnerItems = currentDayMenu.filter(item => item.meal_type === 'Dinner');

  const getTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getToday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Food Menu</h1>
        <button 
          onClick={fetchMenu}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Refresh Menu
        </button>
      </div>

      {/* Today's Highlight */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold">Today's Menu</h2>
        </div>
        <p className="text-indigo-100">Check out what's cooking for {getToday()}!</p>
        {getToday() !== selectedDay && (
          <button
            onClick={() => setSelectedDay(getToday())}
            className="mt-3 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors duration-200"
          >
            View Today's Menu
          </button>
        )}
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Select Day</h3>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${getToday() === day ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {day}
              {getToday() === day && (
                <span className="ml-1 text-xs">📅</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu for Selected Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakfast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
            <div className="flex items-center space-x-2">
              {getMealIcon('Breakfast')}
              <h3 className="text-lg font-semibold text-gray-900">Breakfast</h3>
            </div>
            <p className="text-sm text-yellow-600 mt-1">7:00 AM - 10:00 AM</p>
          </div>
          
          <div className="p-6 space-y-4">
            {breakfastItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className="font-semibold text-gray-900">₹{item.price}</span>
                </div>
              </div>
            ))}
            
            {breakfastItems.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>₹{getTotalPrice(breakfastItems)}</span>
                </div>
              </div>
            )}
            
            {breakfastItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <p>No breakfast items</p>
              </div>
            )}
          </div>
        </div>

        {/* Lunch */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
            <div className="flex items-center space-x-2">
              {getMealIcon('Lunch')}
              <h3 className="text-lg font-semibold text-gray-900">Lunch</h3>
            </div>
            <p className="text-sm text-orange-600 mt-1">12:00 PM - 3:00 PM</p>
          </div>
          
          <div className="p-6 space-y-4">
            {lunchItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className="font-semibold text-gray-900">₹{item.price}</span>
                </div>
              </div>
            ))}
            
            {lunchItems.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>₹{getTotalPrice(lunchItems)}</span>
                </div>
              </div>
            )}
            
            {lunchItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <p>No lunch items</p>
              </div>
            )}
          </div>
        </div>

        {/* Dinner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center space-x-2">
              {getMealIcon('Dinner')}
              <h3 className="text-lg font-semibold text-gray-900">Dinner</h3>
            </div>
            <p className="text-sm text-blue-600 mt-1">7:00 PM - 10:00 PM</p>
          </div>
          
          <div className="p-6 space-y-4">
            {dinnerItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className="font-semibold text-gray-900">₹{item.price}</span>
                </div>
              </div>
            ))}
            
            {dinnerItems.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>₹{getTotalPrice(dinnerItems)}</span>
                </div>
              </div>
            )}
            
            {dinnerItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <p>No dinner items</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Weekly Menu Summary</h3>
        
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-4 min-w-full">
            {daysOfWeek.map((day) => {
              const dayMenu = menu.filter(item => item.day === day);
              const dayTotal = getTotalPrice(dayMenu);
              
              return (
                <div 
                  key={day} 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                    selectedDay === day 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${getToday() === day ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="text-center">
                    <h4 className={`font-medium ${selectedDay === day ? 'text-indigo-900' : 'text-gray-900'}`}>
                      {day}
                      {getToday() === day && <span className="ml-1">📅</span>}
                    </h4>
                    <p className={`text-sm mt-1 ${selectedDay === day ? 'text-indigo-600' : 'text-gray-600'}`}>
                      {dayMenu.length} items
                    </p>
                    <p className={`font-semibold mt-2 ${selectedDay === day ? 'text-indigo-900' : 'text-gray-900'}`}>
                      ₹{dayTotal}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p>🕐 <strong>Breakfast:</strong> 7:00 AM - 10:00 AM</p>
                <p>🕐 <strong>Lunch:</strong> 12:00 PM - 3:00 PM</p>
                <p>🕐 <strong>Dinner:</strong> 7:00 PM - 10:00 PM</p>
              </div>
              <div>
                <p>🥗 Fresh ingredients used daily</p>
                <p>🌶️ Spice levels can be customized</p>
                <p>📋 Menu subject to seasonal changes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;