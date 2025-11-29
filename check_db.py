import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'backend', 'hostel.db')

def check_users():
    if not os.path.exists(DATABASE):
        print(f"Database not found at {DATABASE}")
        return

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    print("--- Admins ---")
    try:
        cursor.execute("SELECT * FROM admins")
        admins = cursor.fetchall()
        for admin in admins:
            print(admin)
    except Exception as e:
        print(f"Error reading admins: {e}")

    print("\n--- Students ---")
    try:
        cursor.execute("SELECT * FROM students")
        students = cursor.fetchall()
        for student in students:
            print(student)
    except Exception as e:
        print(f"Error reading students: {e}")

    conn.close()

if __name__ == "__main__":
    check_users()
