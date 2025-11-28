import sqlite3
import random
from datetime import datetime, timedelta

# Create database connection
conn = sqlite3.connect('hostel_management.db')
cursor = conn.cursor()

print("Database created")

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS rooms (
    room_id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    room_id INTEGER,
    join_date DATE NOT NULL,
    rent_due DATE NOT NULL,
    paid_status TEXT DEFAULT 'Pending',
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    room_id INTEGER,
    complaint_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    raised_date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students (student_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    amount REAL NOT NULL,
    payment_date DATE,
    status TEXT DEFAULT 'Unpaid',
    deadline DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students (student_id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS menu (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    snacks TEXT NOT NULL,
    dinner TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS waiting_list (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    join_date DATE NOT NULL
)
''')

print("Tables created")

# Insert room data
rooms_data = [
    ('A101', 2),
    ('A102', 3),
    ('A103', 4),
    ('B201', 2),
    ('B202', 4),
    ('B203', 3)
]

for room_number, capacity in rooms_data:
    cursor.execute('INSERT INTO rooms (room_number, capacity) VALUES (?, ?)', (room_number, capacity))

# Insert student data
students_data = [
    ('Rajesh Kumar', 'Male', '9876543210', 'rajesh@email.com', 1, '2024-08-15', '2024-12-15', 'Paid'),
    ('Priya Sharma', 'Female', '9876543211', 'priya@email.com', 1, '2024-08-20', '2024-12-20', 'Pending'),
    ('Amit Singh', 'Male', '9876543212', 'amit@email.com', 2, '2024-09-01', '2024-12-25', 'Paid'),
    ('Sneha Patel', 'Female', '9876543213', 'sneha@email.com', 2, '2024-09-05', '2024-12-30', 'Pending'),
    ('Vikram Gupta', 'Male', '9876543214', 'vikram@email.com', 2, '2024-09-10', '2025-01-05', 'Paid'),
    ('Kavya Reddy', 'Female', '9876543215', 'kavya@email.com', 3, '2024-09-15', '2025-01-10', 'Pending'),
    ('Rohit Mehta', 'Male', '9876543216', 'rohit@email.com', 3, '2024-09-20', '2025-01-15', 'Paid'),
    ('Anita Joshi', 'Female', '9876543217', 'anita@email.com', 4, '2024-10-01', '2025-01-20', 'Pending'),
    ('Suresh Nair', 'Male', '9876543218', 'suresh@email.com', 5, '2024-10-05', '2025-01-25', 'Paid'),
    ('Deepika Shah', 'Female', '9876543219', 'deepika@email.com', 6, '2024-10-10', '2025-01-30', 'Pending')
]

for name, gender, phone, email, room_id, join_date, rent_due, paid_status in students_data:
    cursor.execute('INSERT INTO students (name, gender, phone, email, room_id, join_date, rent_due, paid_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                   (name, gender, phone, email, room_id, join_date, rent_due, paid_status))

# Update room occupancy
cursor.execute('''
UPDATE rooms 
SET current_occupancy = (
    SELECT COUNT(*) 
    FROM students 
    WHERE students.room_id = rooms.room_id
)
''')

# Insert payment data
payments_data = [
    (1, 7500.00, '2024-11-15', 'Paid', '2024-12-15'),
    (2, 7500.00, None, 'Unpaid', '2024-12-20'),
    (3, 8000.00, '2024-11-20', 'Paid', '2024-12-25'),
    (4, 6500.00, None, 'Unpaid', '2024-12-30'),
    (5, 7200.00, '2024-11-25', 'Paid', '2025-01-05'),
    (6, 8500.00, None, 'Unpaid', '2025-01-10'),
    (7, 9000.00, '2024-11-28', 'Paid', '2025-01-15'),
    (8, 6800.00, None, 'Unpaid', '2025-01-20')
]

for student_id, amount, payment_date, status, deadline in payments_data:
    cursor.execute('INSERT INTO payments (student_id, amount, payment_date, status, deadline) VALUES (?, ?, ?, ?, ?)', 
                   (student_id, amount, payment_date, status, deadline))

# Insert complaint data
complaints_data = [
    (1, 1, 'plumbing', 'Tap in bathroom is leaking continuously', 'Resolved', '2024-11-01'),
    (3, 2, 'electrical', 'Power socket not working in room', 'Pending', '2024-11-10'),
    (5, 3, 'cleaning', 'Common area needs deep cleaning', 'Resolved', '2024-11-05'),
    (7, 3, 'broken furniture', 'Study table drawer is broken', 'Pending', '2024-11-15'),
    (2, 1, 'WiFi issue', 'Internet connection very slow', 'Pending', '2024-11-20'),
    (9, 5, 'electrical', 'Fan making noise and not working properly', 'Resolved', '2024-11-12')
]

for student_id, room_id, complaint_type, description, status, raised_date in complaints_data:
    cursor.execute('INSERT INTO complaints (student_id, room_id, complaint_type, description, status, raised_date) VALUES (?, ?, ?, ?, ?, ?)', 
                   (student_id, room_id, complaint_type, description, status, raised_date))

# Insert menu data
menu_data = [
    ('Monday', 'Poha, Tea', 'Dal Rice, Roti, Sabji', 'Samosa, Tea', 'Rajma Rice, Roti'),
    ('Tuesday', 'Upma, Coffee', 'Chole Rice, Roti, Salad', 'Pakoda, Tea', 'Paneer Curry, Rice, Roti'),
    ('Wednesday', 'Idli Sambhar, Coffee', 'Mixed Dal, Rice, Roti, Pickle', 'Biscuits, Tea', 'Aloo Gobi, Rice, Roti'),
    ('Thursday', 'Paratha, Curd, Tea', 'Kadhi Rice, Roti, Papad', 'Maggi, Tea', 'Chicken Curry, Rice, Roti'),
    ('Friday', 'Dosa, Chutney, Coffee', 'Rajma Rice, Roti, Salad', 'Vada Pav, Tea', 'Fish Curry, Rice, Roti'),
    ('Saturday', 'Aloo Paratha, Curd, Tea', 'Biryani, Raita, Pickle', 'Sandwiches, Tea', 'Dal Makhani, Rice, Naan'),
    ('Sunday', 'Puri Sabji, Tea', 'Special Thali', 'Sweets, Tea', 'Mutton Curry, Rice, Roti')
]

for day, breakfast, lunch, snacks, dinner in menu_data:
    cursor.execute('INSERT INTO menu (day, breakfast, lunch, snacks, dinner) VALUES (?, ?, ?, ?, ?)', 
                   (day, breakfast, lunch, snacks, dinner))

# Insert waiting list data
waiting_list_data = [
    ('Ravi Agarwal', '9876543220', '2024-12-01'),
    ('Meera Jain', '9876543221', '2024-12-05'),
    ('Karan Malhotra', '9876543222', '2024-12-10'),
    ('Sonia Kapoor', '9876543223', '2024-12-15')
]

for student_name, phone, join_date in waiting_list_data:
    cursor.execute('INSERT INTO waiting_list (student_name, phone, join_date) VALUES (?, ?, ?)', 
                   (student_name, phone, join_date))

# Commit changes and close connection
conn.commit()
conn.close()

print("Sample synthetic data inserted successfully")