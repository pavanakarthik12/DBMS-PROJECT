import requests
import json

def verify_credentials():
    url = 'http://127.0.0.1:5000/api/login'
    
    print("1. Testing Admin Login (admin/admin123)...")
    admin_payload = {
        'username': 'admin',
        'password': 'admin123',
        'userType': 'admin'
    }
    try:
        resp = requests.post(url, json=admin_payload)
        data = resp.json()
        if resp.status_code == 200 and data.get('success') and data['user']['type'] == 'admin':
            print("   [PASS] Admin login successful. User Type: admin")
        else:
            print(f"   [FAIL] Admin login failed. Status: {resp.status_code}, Response: {data}")
    except Exception as e:
        print(f"   [FAIL] Error: {e}")

    print("\n2. Testing Student Login (student/student123)...")
    student_payload = {
        'username': 'student',
        'password': 'student123',
        'userType': 'student'
    }
    try:
        resp = requests.post(url, json=student_payload)
        data = resp.json()
        if resp.status_code == 200 and data.get('success') and data['user']['type'] == 'student':
            print("   [PASS] Student login successful. User Type: student")
        else:
            print(f"   [FAIL] Student login failed. Status: {resp.status_code}, Response: {data}")
    except Exception as e:
        print(f"   [FAIL] Error: {e}")

if __name__ == "__main__":
    verify_credentials()
