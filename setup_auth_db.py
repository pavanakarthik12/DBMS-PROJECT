import sqlite3
import os

DB_PATH = 'backend/hostel.db'

def inspect_and_fix_db():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print("Existing tables:", tables)

    # Create users table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            student_id INTEGER,
            email TEXT
        )
    """)
    
    # Check if we need to insert test users
    cursor.execute("SELECT count(*) FROM users")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Inserting test users...")
        # Admin
        cursor.execute("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)",
                      ('admin', 'admin123', 'admin', 'admin@hostel.com'))
        
        # Student
        cursor.execute("INSERT INTO users (username, password, role, email, student_id) VALUES (?, ?, ?, ?, ?)",
                      ('student', 'student123', 'student', 'student@hostel.com', 1))
        conn.commit()
        print("Test users inserted.")
    else:
        print(f"Users table has {count} users.")
        cursor.execute("SELECT * FROM users")
        print(cursor.fetchall())

    conn.close()

if __name__ == '__main__':
    inspect_and_fix_db()
