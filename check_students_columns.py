import sqlite3
import os

db_path = 'backend/hostel_management.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(students)")
columns = [c[1] for c in cursor.fetchall()]
print("Students Columns:")
for c in columns:
    print(c)
conn.close()
