import sqlite3
import os

db_path = os.path.join('backend', 'hostel.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    db_path = os.path.join('backend', 'hostel_management.db')

print(f"Updating database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if columns exist
    cursor.execute("PRAGMA table_info(waiting_list)")
    columns = [info[1] for info in cursor.fetchall()]
    
    if 'branch' not in columns:
        print("Adding branch column...")
        cursor.execute("ALTER TABLE waiting_list ADD COLUMN branch TEXT")
    else:
        print("branch column already exists.")
        
    if 'year_of_study' not in columns:
        print("Adding year_of_study column...")
        cursor.execute("ALTER TABLE waiting_list ADD COLUMN year_of_study INTEGER")
    else:
        print("year_of_study column already exists.")
        
    conn.commit()
    print("Schema update complete.")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
