import React, { useState, useEffect } from 'react';
import { generalAPI } from '../services/api';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Failed to fetch menu data');
      console.error('Menu error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDay = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isToday = (day) => {
    return day === getCurrentDay();
  };

  if (loading) {
    return <div className="loading">Loading menu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const todayMenu = menu.find(item => item.day === getCurrentDay());

  return (
    <div className="dashboard">
      <h1>Food Menu</h1>
      
      {todayMenu && (
        <div className="card" style={{marginBottom: '30px', backgroundColor: '#f8f9fc', border: '2px solid #667eea'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{margin: 0, color: '#667eea'}}>Today's Special - {todayMenu.day}</h2>
            <span style={{
              marginLeft: '15px',
              padding: '5px 10px',
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              TODAY
            </span>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <div className="menu-item">
              <div className="menu-item-label" style={{color: '#667eea'}}>🌅 Breakfast</div>
              <div className="menu-item-content" style={{fontWeight: '500'}}>{todayMenu.breakfast}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label" style={{color: '#667eea'}}>🍽️ Lunch</div>
              <div className="menu-item-content" style={{fontWeight: '500'}}>{todayMenu.lunch}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label" style={{color: '#667eea'}}>🍪 Snacks</div>
              <div className="menu-item-content" style={{fontWeight: '500'}}>{todayMenu.snacks}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label" style={{color: '#667eea'}}>🌙 Dinner</div>
              <div className="menu-item-content" style={{fontWeight: '500'}}>{todayMenu.dinner}</div>
            </div>
          </div>
        </div>
      )}

      <h2 style={{marginBottom: '20px'}}>Weekly Menu</h2>
      <div className="menu-grid">
        {menu.map((dayMenu) => (
          <div 
            key={dayMenu.menu_id} 
            className={`menu-card ${isToday(dayMenu.day) ? 'today-highlight' : ''}`}
            style={{
              border: isToday(dayMenu.day) ? '2px solid #667eea' : '1px solid #e9ecef',
              backgroundColor: isToday(dayMenu.day) ? '#f8f9fc' : 'white'
            }}
          >
            <div className="menu-day" style={{
              color: isToday(dayMenu.day) ? '#667eea' : '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              {dayMenu.day}
              {isToday(dayMenu.day) && (
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  TODAY
                </span>
              )}
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label">🌅 Breakfast</div>
              <div className="menu-item-content">{dayMenu.breakfast}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label">🍽️ Lunch</div>
              <div className="menu-item-content">{dayMenu.lunch}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label">🍪 Snacks</div>
              <div className="menu-item-content">{dayMenu.snacks}</div>
            </div>
            
            <div className="menu-item">
              <div className="menu-item-label">🌙 Dinner</div>
              <div className="menu-item-content">{dayMenu.dinner}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-grid" style={{marginTop: '30px'}}>
        <div className="card">
          <h3>Meal Timings</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                🌅 <strong>Breakfast</strong>
              </span>
              <span style={{color: '#6c757d'}}>7:00 AM - 9:00 AM</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                🍽️ <strong>Lunch</strong>
              </span>
              <span style={{color: '#6c757d'}}>12:00 PM - 2:00 PM</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                🍪 <strong>Snacks</strong>
              </span>
              <span style={{color: '#6c757d'}}>4:00 PM - 6:00 PM</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                🌙 <strong>Dinner</strong>
              </span>
              <span style={{color: '#6c757d'}}>7:00 PM - 9:00 PM</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Menu Information</h3>
          <div style={{fontSize: '14px', color: '#6c757d', lineHeight: '1.6'}}>
            <p><strong>✅ What's Included:</strong></p>
            <ul style={{paddingLeft: '20px', margin: '10px 0'}}>
              <li>Fresh, hygienic meals prepared daily</li>
              <li>Vegetarian and non-vegetarian options</li>
              <li>Regional variety throughout the week</li>
              <li>Special meals on festivals</li>
            </ul>
            
            <p><strong>📋 Notes:</strong></p>
            <ul style={{paddingLeft: '20px', margin: '0'}}>
              <li>Menu may change based on availability</li>
              <li>Special dietary requests can be accommodated</li>
              <li>Outside food is allowed in rooms</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3>Nutritional Guidelines</h3>
          <div style={{fontSize: '14px', color: '#6c757d'}}>
            <p style={{marginBottom: '15px'}}>Our menu is designed to provide balanced nutrition:</p>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Proteins</span>
              <span style={{color: '#28a745', fontWeight: 'bold'}}>25%</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Carbohydrates</span>
              <span style={{color: '#ffc107', fontWeight: 'bold'}}>45%</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Vegetables</span>
              <span style={{color: '#28a745', fontWeight: 'bold'}}>20%</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Others</span>
              <span style={{color: '#6c757d', fontWeight: 'bold'}}>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;