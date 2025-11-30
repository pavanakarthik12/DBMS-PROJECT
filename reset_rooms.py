import sqlite3
import os

db_path = 'backend/hostel_management.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Resetting room occupancy...")
cursor.execute("UPDATE rooms SET current_occupancy = 0")
cursor.execute("DELETE FROM students WHERE email LIKE 'test_%'")
conn.commit()
conn.close()
print("Room occupancy reset and test students removed.")
