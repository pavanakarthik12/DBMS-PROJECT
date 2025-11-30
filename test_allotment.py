import requests
import sqlite3
import json
from datetime import datetime

BASE_URL = 'http://127.0.0.1:5000/api'
DB_PATH = 'backend/hostel_management.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def test_allotment():
    print("Starting Allotment Test...")
    
    # 1. Add student to waiting list
    student_data = {
        'student_name': 'Test Student',
        'phone': '9999999999',
        'join_date': datetime.now().strftime('%Y-%m-%d'),
        'branch': 'CSE',
        'year_of_study': 2
    }
    
    # Manually insert into waiting_list to ensure we have an ID (since API doesn't return ID)
    conn = get_db_connection()
    cursor = conn.cursor()
    import time
    unique_email = f"test_{int(time.time())}@example.com"
    cursor.execute("INSERT INTO waiting_list (name, phone, applied_date, branch, year_of_study, status, email) VALUES (?, ?, ?, ?, ?, 'Waiting', ?)", 
                   (student_data['student_name'], student_data['phone'], student_data['join_date'], student_data['branch'], student_data['year_of_study'], unique_email))
    waiting_id = cursor.lastrowid
    conn.commit()
    print(f"Added waiting student with ID: {waiting_id}")
    
    # Get a room number
    cursor.execute("SELECT room_number, room_id, current_occupancy FROM rooms WHERE capacity > current_occupancy LIMIT 1")
    room = cursor.fetchone()
    if not room:
        print("No available rooms for testing.")
        return
    
    room_number = room['room_number']
    room_id = room['room_id']
    initial_occupancy = room['current_occupancy']
    print(f"Selected Room: {room_number} (ID: {room_id}), Occupancy: {initial_occupancy}")
    
    conn.close()
    
    # 2. Allot student to room using Room Number
    print(f"Allotting student {waiting_id} to room {room_number}...")
    response = requests.post(f"{BASE_URL}/admin/waiting-list/{waiting_id}/assign", json={'room_id': room_number})
    
    if response.status_code == 200:
        print("Allotment successful!")
    else:
        print(f"Allotment failed: {response.json()}")
        return

    # 3. Verify Database Updates
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check Student
    cursor.execute("SELECT * FROM students WHERE phone = ?", (student_data['phone'],))
    student = cursor.fetchone()
    if student:
        print(f"Student found in students table: {student['name']}")
        print(f"  Branch: {student['branch']}")
        print(f"  Year: {student['year_of_study']}")
        print(f"  Payment Status: {student['payment_status']}")
        print(f"  Room ID: {student['room_id']}")
        assert student['room_id'] == room_id
        assert student['payment_status'] == 'Pending'
    else:
        print("Student NOT found in students table!")
        
    # Check Room Occupancy
    cursor.execute("SELECT current_occupancy FROM rooms WHERE room_id = ?", (room_id,))
    new_occupancy = cursor.fetchone()['current_occupancy']
    print(f"New Room Occupancy: {new_occupancy}")
    assert new_occupancy == initial_occupancy + 1
    
    # Check Waiting List Status
    cursor.execute("SELECT status FROM waiting_list WHERE waiting_id = ?", (waiting_id,))
    status = cursor.fetchone()['status']
    print(f"Waiting List Status: {status}")
    assert status == 'Assigned'
    
    conn.close()
    
    # 4. Verify get_room_details API
    print(f"Fetching details for room {room_number}...")
    response = requests.get(f"{BASE_URL}/rooms/{room_number}/details")
    if response.status_code == 200:
        data = response.json()['data']
        print("Room Details Fetched:")
        print(f"  Room Number: {data['room_number']}")
        print(f"  Students: {len(data['students'])}")
        
        # Find our student
        found = False
        for s in data['students']:
            if s['phone'] == student_data['phone']:
                print("  Found new student in room details!")
                print(f"    Name: {s['name']}")
                print(f"    Branch: {s['branch']}")
                print(f"    Year: {s['year_of_study']}")
                print(f"    Payment: {s['payment_status']}")
                found = True
                break
        if not found:
            print("  New student NOT found in room details!")
    else:
        print(f"Failed to fetch room details: {response.json()}")

if __name__ == "__main__":
    test_allotment()
