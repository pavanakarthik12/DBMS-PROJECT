import sqlite3
import os
from datetime import datetime, timedelta

DATABASE = os.path.join(os.path.dirname(__file__), 'backend', 'hostel.db')

def init_db():
    if os.path.exists(DATABASE):
        try:
            os.remove(DATABASE)
            print("Removed existing database.")
        except:
            pass
            
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create Admins Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admins (
        admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Create Rooms Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rooms (
        room_id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number TEXT NOT NULL UNIQUE,
        capacity INTEGER NOT NULL,
        current_occupancy INTEGER DEFAULT 0,
        room_type TEXT NOT NULL,
        floor INTEGER NOT NULL,
        price REAL NOT NULL
    )
    """)
    
    # Create Students Table - Added username
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        room_id INTEGER,
        phone TEXT,
        parent_name TEXT,
        parent_phone TEXT,
        address TEXT,
        status TEXT DEFAULT 'Active',
        joined_date TEXT,
        FOREIGN KEY (room_id) REFERENCES rooms (room_id)
    )
    """)
    
    # Create Payments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_date TEXT,
        deadline TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        transaction_id TEXT,
        FOREIGN KEY (student_id) REFERENCES students (student_id)
    )
    """)
    
    # Create Complaints Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        room_id INTEGER,
        complaint_type TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        raised_date TEXT NOT NULL,
        resolved_date TEXT,
        FOREIGN KEY (student_id) REFERENCES students (student_id),
        FOREIGN KEY (room_id) REFERENCES rooms (room_id)
    )
    """)
    
    # Create Menu Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL UNIQUE,
        breakfast TEXT,
        lunch TEXT,
        snacks TEXT,
        dinner TEXT
    )
    """)
    
    # Create Waiting List Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS waiting_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        join_date TEXT NOT NULL,
        status TEXT DEFAULT 'Waiting'
    )
    """)
    
    # Create Maintenance Requests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance_requests (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        room_id INTEGER,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT DEFAULT 'Medium',
        status TEXT DEFAULT 'Pending',
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students (student_id),
        FOREIGN KEY (room_id) REFERENCES rooms (room_id)
    )
    """)
    
    # Create Room Change Requests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS room_change_requests (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        current_room INTEGER,
        requested_room INTEGER,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        request_date TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students (student_id),
        FOREIGN KEY (current_room) REFERENCES rooms (room_id),
        FOREIGN KEY (requested_room) REFERENCES rooms (room_id)
    )
    """)
    
    # Create Announcements Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
    )
    """)
    
    # Insert Sample Data
    
    # Admins
    cursor.execute("INSERT INTO admins (username, password, email) VALUES (?, ?, ?)", 
                   ('admin', 'admin123', 'admin@hostel.com'))
    
    # Rooms
    rooms = [
        ('101', 2, 'Single', 1, 8000),
        ('102', 2, 'Shared', 1, 6000),
        ('103', 3, 'Shared', 1, 5000),
        ('201', 1, 'Single', 2, 9000),
        ('202', 2, 'Shared', 2, 6500),
        ('203', 3, 'Shared', 2, 5500)
    ]
    for r in rooms:
        cursor.execute("INSERT INTO rooms (room_number, capacity, room_type, floor, price) VALUES (?, ?, ?, ?, ?)", r)
    
    # Students - Added usernames
    students = [
        ('John Doe', 'student', 'john@example.com', 'student123', 1, '9876543210', 'Active'),
        ('Jane Smith', 'jane', 'jane@example.com', 'password123', 2, '9876543211', 'Active'),
        ('Mike Johnson', 'mike', 'mike@example.com', 'password123', 3, '9876543212', 'Active')
    ]
    for s in students:
        cursor.execute("""
            INSERT INTO students (name, username, email, password, room_id, phone, status, joined_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (s[0], s[1], s[2], s[3], s[4], s[5], s[6], datetime.now().strftime('%Y-%m-%d')))
        
        # Update room occupancy
        cursor.execute("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = ?", (s[4],))
        
        # Create dummy payment
        cursor.execute("""
            INSERT INTO payments (student_id, amount, deadline, payment_type, status)
            VALUES (?, ?, ?, ?, ?)
        """, (rooms[s[4]-1][4], 5000, (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'), 'Hostel Fee', 'Pending'))

    # Menu
    menu_items = [
        ('Monday', 'Idli Sambhar', 'Rice & Curry', 'Biscuits', 'Chapati & Dal'),
        ('Tuesday', 'Dosa', 'Lemon Rice', 'Cake', 'Veg Biryani'),
        ('Wednesday', 'Pongal', 'Sambar Rice', 'Puffs', 'Curd Rice'),
        ('Thursday', 'Upma', 'Fried Rice', 'Samosa', 'Roti & Sabji'),
        ('Friday', 'Poori', 'Full Meals', 'Bajji', 'Pulav'),
        ('Saturday', 'Vada', 'Variety Rice', 'Sundal', 'Noodles'),
        ('Sunday', 'Bread Omelette', 'Chicken Biryani', 'Corn', 'Parotta')
    ]
    for m in menu_items:
        cursor.execute("INSERT INTO menu (day, breakfast, lunch, snacks, dinner) VALUES (?, ?, ?, ?, ?)", m)
        
    # Announcements
    cursor.execute("""
        INSERT INTO announcements (title, message, category, date)
        VALUES 
        ('Welcome to the Hostel Management System', 'We are pleased to announce the launch of our new hostel management platform.', 'General', ?),
        ('Maintenance Schedule', 'Regular maintenance will be conducted on all floors this weekend.', 'Maintenance', ?)
    """, (datetime.now().strftime('%Y-%m-%d'), (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')))

    conn.commit()
    conn.close()
    print("Database initialized successfully with sample data.")

if __name__ == "__main__":
    init_db()
