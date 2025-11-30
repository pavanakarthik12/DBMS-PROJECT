import requests
import json
import sqlite3
import os

def get_first_occupied_room_id():
    db_path = os.path.join('backend', 'hostel.db')
    if not os.path.exists(db_path):
        db_path = os.path.join('backend', 'hostel_management.db')
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT room_id FROM rooms WHERE current_occupancy > 0 LIMIT 1")
    room = cursor.fetchone()
    conn.close()
    return room[0] if room else None

def test_room_details():
    room_id = get_first_occupied_room_id()
    if not room_id:
        print("No occupied rooms found to test.")
        return

    print(f"Testing room details for room_id: {room_id}")
    try:
        resp = requests.get(f'http://127.0.0.1:5000/api/rooms/{room_id}/details')
        if resp.status_code == 200:
            data = resp.json()
            if data['success']:
                print("Success! Room details fetched.")
                students = data['data']['students']
                print(f"Found {len(students)} students.")
                for student in students:
                    print(f"Name: {student.get('name')}")
                    print(f"Branch: {student.get('branch')}")
                    print(f"Year: {student.get('year_of_study')}")
                    print("-" * 20)
            else:
                print(f"Failed: {data['message']}")
        else:
            print(f"Error: Status {resp.status_code}")
            print(resp.text)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_room_details()
