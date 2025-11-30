import sqlite3
import os

db_path = 'backend/hostel_management.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(students)")
columns = [c[1] for c in cursor.fetchall()]

if 'status' not in columns:
    print("Adding status to students...")
    cursor.execute("ALTER TABLE students ADD COLUMN status TEXT DEFAULT 'Active'")
    conn.commit()
    print("Status column added.")
else:
    print("Status column already exists.")

conn.close()
