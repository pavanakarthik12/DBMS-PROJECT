import sqlite3
import os

def update_db():
    db_path = os.path.join('backend', 'hostel_management.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Update students table
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN branch TEXT")
        print("Added branch to students")
    except:
        print("branch already in students")

    try:
        cursor.execute("ALTER TABLE students ADD COLUMN year_of_study TEXT")
        print("Added year_of_study to students")
    except:
        print("year_of_study already in students")

    try:
        cursor.execute("ALTER TABLE students ADD COLUMN payment_status TEXT DEFAULT 'Pending'")
        print("Added payment_status to students")
    except:
        print("payment_status already in students")

    # Update waiting_list table
    try:
        cursor.execute("ALTER TABLE waiting_list ADD COLUMN branch TEXT")
        print("Added branch to waiting_list")
    except:
        print("branch already in waiting_list")

    try:
        cursor.execute("ALTER TABLE waiting_list ADD COLUMN year_of_study TEXT")
        print("Added year_of_study to waiting_list")
    except:
        print("year_of_study already in waiting_list")

    # Sample Data
    cursor.execute("UPDATE students SET branch = 'CSE', year_of_study = '3rd Year', payment_status = 'Paid' WHERE student_id = 1")
    cursor.execute("UPDATE students SET branch = 'ECE', year_of_study = '2nd Year', payment_status = 'Pending' WHERE student_id = 2")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_db()
