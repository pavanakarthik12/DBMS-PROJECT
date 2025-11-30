import sqlite3
import os
import random

db_path = os.path.join('backend', 'hostel.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    # Try the other one
    db_path = os.path.join('backend', 'hostel_management.db')

print(f"Updating database: {db_path}")

branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']
years = [1, 2, 3, 4]

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all students
    cursor.execute("SELECT student_id, name FROM students")
    students = cursor.fetchall()
    
    print(f"Found {len(students)} students. Updating...")
    
    for student in students:
        student_id = student[0]
        name = student[1]
        
        branch = random.choice(branches)
        year = random.choice(years)
        
        cursor.execute("""
            UPDATE students 
            SET branch = ?, year_of_study = ? 
            WHERE student_id = ?
        """, (branch, year, student_id))
        
        print(f"Updated {name}: {branch} - Year {year}")
        
    conn.commit()
    print("Update complete.")
    
    # Verify
    cursor.execute("SELECT name, branch, year_of_study FROM students LIMIT 5")
    print("\nVerification (First 5):")
    for row in cursor.fetchall():
        print(row)
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
