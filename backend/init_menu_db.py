#!/usr/bin/env python3
import sqlite3
from datetime import datetime

def init_menu_database():
    """Initialize menu database with all 7 days and 4 meals each day"""
    try:
        conn = sqlite3.connect('hostel_management.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Drop and recreate menu table
        cursor.execute("DROP TABLE IF EXISTS menu")
        cursor.execute("""
            CREATE TABLE menu (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day TEXT NOT NULL,
                meal_type TEXT NOT NULL,
                item_name TEXT NOT NULL,
                description TEXT,
                UNIQUE(day, meal_type)
            )
        """)
        
        # Complete 7-day menu data (28 entries total)
        menu_data = [
            # Monday
            ('Monday', 'Breakfast', 'Aloo Paratha, Curd, Pickle', 'Stuffed potato flatbread with yogurt and spicy pickle'),
            ('Monday', 'Lunch', 'Dal Rice, Mixed Vegetables, Roti', 'Yellow lentils with rice, seasonal vegetables and wheat bread'),
            ('Monday', 'Snacks', 'Samosa, Green Chutney, Tea', 'Crispy pastry with mint chutney and masala tea'),
            ('Monday', 'Dinner', 'Paneer Curry, Rice, Salad', 'Cottage cheese curry with basmati rice and fresh salad'),
            
            # Tuesday
            ('Tuesday', 'Breakfast', 'Idli Sambhar, Coconut Chutney', 'Steamed rice cakes with lentil curry and coconut chutney'),
            ('Tuesday', 'Lunch', 'Chole Bhature, Onion Salad', 'Spiced chickpeas with fried bread and sliced onions'),
            ('Tuesday', 'Snacks', 'Pakora, Tamarind Chutney, Chai', 'Vegetable fritters with sweet chutney and spiced tea'),
            ('Tuesday', 'Dinner', 'Chicken Curry, Rice, Raita', 'Spicy chicken curry with steamed rice and yogurt salad'),
            
            # Wednesday
            ('Wednesday', 'Breakfast', 'Poha, Jalebi, Coffee', 'Flattened rice with vegetables and sweet spirals'),
            ('Wednesday', 'Lunch', 'Rajma Rice, Papad, Pickle', 'Kidney bean curry with rice and crispy wafer'),
            ('Wednesday', 'Snacks', 'Bhel Puri, Lemon Water', 'Puffed rice chaat with tangy chutneys'),
            ('Wednesday', 'Dinner', 'Fish Curry, Rice, Dal', 'Coastal fish curry with steamed rice and lentils'),
            
            # Thursday
            ('Thursday', 'Breakfast', 'Upma, Banana, Milk Tea', 'Semolina porridge with fresh banana and creamy tea'),
            ('Thursday', 'Lunch', 'Vegetable Biryani, Raita, Shorba', 'Fragrant rice with vegetables and clear soup'),
            ('Thursday', 'Snacks', 'Vada Pav, Fried Chili', 'Mumbai street food with spiced potato and chilies'),
            ('Thursday', 'Dinner', 'Mutton Curry, Naan, Salad', 'Tender mutton in spices with butter naan'),
            
            # Friday
            ('Friday', 'Breakfast', 'Masala Dosa, Sambhar, Chutney', 'Crispy crepe with potato filling and accompaniments'),
            ('Friday', 'Lunch', 'Pulao, Paneer Makhani, Naan', 'Spiced rice with creamy paneer curry'),
            ('Friday', 'Snacks', 'Aloo Chaat, Lassi', 'Spiced potato chaat with sweet yogurt drink'),
            ('Friday', 'Dinner', 'Prawn Curry, Rice, Stir Fry', 'Coastal prawn curry with sautéed vegetables'),
            
            # Saturday
            ('Saturday', 'Breakfast', 'Puri Sabji, Halwa, Tea', 'Fried bread with curry and sweet semolina pudding'),
            ('Saturday', 'Lunch', 'Special Thali, Sweet Dish', 'Complete meal with variety of dishes and dessert'),
            ('Saturday', 'Snacks', 'Dhokla, Green Chutney, Coffee', 'Steamed gram flour cake with mint chutney'),
            ('Saturday', 'Dinner', 'Lamb Biryani, Raita, Shorba', 'Aromatic rice with tender lamb and soup'),
            
            # Sunday
            ('Sunday', 'Breakfast', 'Stuffed Paratha, Curd, Pickle', 'Mixed vegetable paratha with yogurt'),
            ('Sunday', 'Lunch', 'South Indian Thali, Payasam', 'Traditional meal with sambhar, rasam and dessert'),
            ('Sunday', 'Snacks', 'Pav Bhaji, Buttermilk', 'Spiced vegetable curry with bread rolls'),
            ('Sunday', 'Dinner', 'Mixed Veg Curry, Pulao, Dessert', 'Chef special vegetables with fragrant rice')
        ]
        
        # Insert menu data
        cursor.executemany(
            "INSERT INTO menu (day, meal_type, item_name, description) VALUES (?, ?, ?, ?)",
            menu_data
        )
        
        conn.commit()
        print(f"✓ Menu database initialized with {len(menu_data)} entries")
        
        # Verify data
        cursor.execute("SELECT COUNT(*) FROM menu")
        count = cursor.fetchone()[0]
        print(f"✓ Total menu entries: {count}")
        
        cursor.execute("SELECT day, COUNT(*) as meals FROM menu GROUP BY day")
        for row in cursor.fetchall():
            print(f"✓ {row['day']}: {row['meals']} meals")
            
        conn.close()
        
    except Exception as e:
        print(f"Error initializing menu database: {e}")

if __name__ == '__main__':
    init_menu_database()