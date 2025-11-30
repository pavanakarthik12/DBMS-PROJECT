import requests
import json

BASE_URL = 'http://127.0.0.1:5000/api'

def test_student_dashboard(student_id):
    print(f"Testing Student Dashboard for Student ID: {student_id}")
    try:
        response = requests.get(f"{BASE_URL}/student/dashboard/{student_id}")
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                student = data['data']['student']
                print("Student Data:")
                print(json.dumps(student, indent=2))
                print("\nRoommates:", data['data']['roommates'])
                print("Maintenance Problems:", data['data']['maintenance_problems'])
                
                if 'payment_status' in student:
                    print(f"\nSUCCESS: Payment Status found: {student['payment_status']}")
                else:
                    print("\nFAILURE: Payment Status NOT found in student data")
            else:
                print("API returned success=False:", data.get('message'))
        else:
            print(f"API Request Failed with status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # Test with a student ID that exists (e.g., 1)
    test_student_dashboard(1)
