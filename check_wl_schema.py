import sqlite3
import os

def check_waiting_list():
    db_path = os.path.join('backend', 'hostel_management.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(waiting_list)")
    columns = cursor.fetchall()
    print("Columns:", [c[1] for c in columns])
    conn.close()

if __name__ == "__main__":
    check_waiting_list()
