import requests
import json
import datetime

def test_waiting_list():
    base_url = 'http://127.0.0.1:5000/api'
    
    print("Testing adding to waiting list with branch and year...")
    data = {
        'student_name': 'Test Student',
        'phone': '1234567890',
        'join_date': datetime.datetime.now().strftime('%Y-%m-%d'),
        'branch': 'CSE',
        'year_of_study': 3
    }
    
    try:
        resp = requests.post(f'{base_url}/waiting-list', json=data)
        print(f"POST Status: {resp.status_code}")
        print(f"POST Response: {resp.text}")
        
        if resp.status_code == 200:
            print("\nVerifying data saved...")
            resp = requests.get(f'{base_url}/waiting-list')
            if resp.status_code == 200:
                waiting_list = resp.json()['data']
                # Find our student
                found = False
                for student in waiting_list:
                    if student['student_name'] == 'Test Student' and student['phone'] == '1234567890':
                        print(f"Found student: {student}")
                        if student.get('branch') == 'CSE' and student.get('year_of_study') == 3:
                            print("SUCCESS: Branch and Year saved correctly!")
                            found = True
                        else:
                            print(f"FAILURE: Branch/Year mismatch. Got: {student.get('branch')}, {student.get('year_of_study')}")
                        break
                if not found:
                    print("FAILURE: Student not found in list")
            else:
                print("Failed to fetch waiting list")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_waiting_list()
