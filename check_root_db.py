import sqlite3
import os

db_path = 'hostel_management.db'
if not os.path.exists(db_path):
    print("Root DB not found")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(students)")
columns = [c[1] for c in cursor.fetchall()]
print("Root DB Students Columns:")
for c in columns:
    print(c)
conn.close()
