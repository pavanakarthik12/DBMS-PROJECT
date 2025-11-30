import sqlite3
import os

db_path = os.path.join('backend', 'hostel.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    # Try the other one
    db_path = os.path.join('backend', 'hostel_management.db')

print(f"Checking database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(students)")
    columns = cursor.fetchall()
    print("Columns in students table:")
    for col in columns:
        print(col)
    conn.close()
except Exception as e:
    print(f"Error: {e}")
