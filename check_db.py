import sqlite3
import os

def check_tables():
    db_path = os.path.join('backend', 'hostel_management.db')
    print(f"Checking DB at: {db_path}")
    if not os.path.exists(db_path):
        print("Database file does not exist!")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables:", [t[0] for t in tables])
        
        if 'maintenance_requests' in [t[0] for t in tables]:
            print("maintenance_requests table EXISTS.")
            cursor.execute("PRAGMA table_info(maintenance_requests)")
            columns = cursor.fetchall()
            print("Columns:", [c[1] for c in columns])
        else:
            print("maintenance_requests table MISSING.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_tables()
