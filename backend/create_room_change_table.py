import sqlite3
from datetime import datetime

def create_room_change_table():
    try:
        conn = sqlite3.connect('hostel_management.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS room_change_requests (
                request_id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                current_room INTEGER NOT NULL,
                requested_room INTEGER NOT NULL,
                reason TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(student_id)
            )
        ''')
        
        conn.commit()
        print("✓ room_change_requests table created successfully")
        
        cursor.execute("SELECT COUNT(*) FROM room_change_requests")
        count = cursor.fetchone()[0]
        print(f"✓ Table has {count} records")
        
        conn.close()
        
    except Exception as e:
        print(f"Error creating table: {e}")

if __name__ == '__main__':
    create_room_change_table()
