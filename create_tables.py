import sqlite3
import os

db_path = os.path.join('backend', 'hostel_management.db')
print(f"Connecting to {db_path}")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create maintenance_requests table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS maintenance_requests (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        room_id INTEGER,
        category TEXT,
        description TEXT,
        priority TEXT,
        status TEXT DEFAULT 'Pending',
        created_at TEXT,
        resolved_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students (student_id),
        FOREIGN KEY (room_id) REFERENCES rooms (room_id)
    )
""")
print("maintenance_requests table created/checked.")

# Create payments table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount REAL,
        status TEXT,
        deadline TEXT,
        payment_date TEXT,
        FOREIGN KEY (student_id) REFERENCES students (student_id)
    )
""")
print("payments table created/checked.")

conn.commit()
conn.close()
print("Tables created successfully.")
