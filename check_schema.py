import sqlite3
import os

def check_schema():
    db_path = os.path.join('backend', 'hostel_management.db')
    if not os.path.exists(db_path):
        print("DB not found")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("--- Students Table ---")
    cursor.execute("PRAGMA table_info(students)")
    columns = [c[1] for c in cursor.fetchall()]
    print(columns)
    for c in columns:
        print(c)
    
    print("\n--- Waiting List Table ---")
    cursor.execute("PRAGMA table_info(waiting_list)")
    columns = [c[1] for c in cursor.fetchall()]
    print(columns)

    conn.close()

if __name__ == "__main__":
    check_schema()
