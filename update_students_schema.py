import sqlite3
import os

db_path = 'backend/hostel_management.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check and add room_id
cursor.execute("PRAGMA table_info(students)")
columns = [c[1] for c in cursor.fetchall()]

if 'room_id' not in columns:
    print("Adding room_id to students...")
    cursor.execute("ALTER TABLE students ADD COLUMN room_id INTEGER")

if 'joined_date' not in columns:
    print("Adding joined_date to students...")
    cursor.execute("ALTER TABLE students ADD COLUMN joined_date TEXT")

if 'payment_status' not in columns:
    print("Adding payment_status to students...")
    cursor.execute("ALTER TABLE students ADD COLUMN payment_status TEXT DEFAULT 'Pending'")

conn.commit()
conn.close()
print("Students schema updated.")
