import sqlite3
from datetime import datetime

# Connect to database
conn = sqlite3.connect('hostel.db')
cursor = conn.cursor()

# Create menu table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS menu (
        menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        item_name TEXT NOT NULL,
        description TEXT,
        price REAL
    )
''')

# Clear existing menu data
cursor.execute('DELETE FROM menu')

# Sample menu data for all 7 days
menu_data = [
    # Monday
    ('Monday', 'Breakfast', 'Aloo Paratha', 'Potato stuffed flatbread with curd', 45),
    ('Monday', 'Lunch', 'Dal Rice', 'Yellow lentils with steamed rice', 65),
    ('Monday', 'Snacks', 'Samosa', 'Crispy fried pastry with potato filling', 30),
    ('Monday', 'Dinner', 'Paneer Curry', 'Cottage cheese curry with roti', 85),
    
    # Tuesday
    ('Tuesday', 'Breakfast', 'Idli Sambhar', 'Steamed rice cakes with lentil curry', 40),
    ('Tuesday', 'Lunch', 'Chole Bhature', 'Spiced chickpeas with fried bread', 75),
    ('Tuesday', 'Snacks', 'Pakora', 'Mixed vegetable fritters', 35),
    ('Tuesday', 'Dinner', 'Chicken Curry', 'Spicy chicken curry with rice', 95),
    
    # Wednesday
    ('Wednesday', 'Breakfast', 'Poha', 'Flattened rice with peanuts and spices', 35),
    ('Wednesday', 'Lunch', 'Rajma Rice', 'Kidney beans curry with rice', 70),
    ('Wednesday', 'Snacks', 'Bread Pakora', 'Bread fritters with chutney', 30),
    ('Wednesday', 'Dinner', 'Veg Biryani', 'Aromatic rice with mixed vegetables', 80),
    
    # Thursday
    ('Thursday', 'Breakfast', 'Upma', 'Semolina porridge with vegetables', 35),
    ('Thursday', 'Lunch', 'Kadhi Rice', 'Yogurt curry with rice', 65),
    ('Thursday', 'Snacks', 'Vada Pav', 'Potato fritter in bread bun', 25),
    ('Thursday', 'Dinner', 'Fish Curry', 'Bengali style fish curry', 100),
    
    # Friday
    ('Friday', 'Breakfast', 'Dosa', 'Crispy rice crepe with sambhar', 45),
    ('Friday', 'Lunch', 'Palak Paneer', 'Spinach with cottage cheese', 75),
    ('Friday', 'Snacks', 'Cutlet', 'Vegetable cutlet with sauce', 35),
    ('Friday', 'Dinner', 'Mutton Curry', 'Spicy mutton curry with roti', 110),
    
    # Saturday
    ('Saturday', 'Breakfast', 'Puri Bhaji', 'Fried bread with potato curry', 50),
    ('Saturday', 'Lunch', 'Chicken Biryani', 'Aromatic rice with chicken', 95),
    ('Saturday', 'Snacks', 'Spring Roll', 'Crispy vegetable spring rolls', 40),
    ('Saturday', 'Dinner', 'Mixed Veg Curry', 'Assorted vegetables in gravy', 70),
    
    # Sunday
    ('Sunday', 'Breakfast', 'Paratha', 'Stuffed flatbread with pickle', 40),
    ('Sunday', 'Lunch', 'Special Thali', 'Complete meal with variety', 100),
    ('Sunday', 'Snacks', 'Chaat', 'Tangy street food snack', 35),
    ('Sunday', 'Dinner', 'Paneer Tikka', 'Grilled cottage cheese with naan', 90),
]

# Insert menu data
cursor.executemany('INSERT INTO menu (day, meal_type, item_name, description, price) VALUES (?, ?, ?, ?, ?)', menu_data)

# Commit and close
conn.commit()
print(f"Menu table created and populated with {len(menu_data)} items")

# Verify
cursor.execute('SELECT COUNT(*) FROM menu')
count = cursor.fetchone()[0]
print(f"Total menu items in database: {count}")

# Show sample
cursor.execute('SELECT * FROM menu WHERE day = "Monday"')
print("\nMonday's menu:")
for row in cursor.fetchall():
    print(f"  {row[2]} - {row[3]}: {row[4]} (₹{row[5]})")

conn.close()
print("\nMenu database setup complete!")
