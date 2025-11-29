import requests
import json

def test_server():
    base_url = 'http://127.0.0.1:5000/api'
    
    print("Testing /api/menu...")
    try:
        resp = requests.get(f'{base_url}/menu')
        print(f"Status: {resp.status_code}")
        print(f"Body: {resp.text[:100]}...")
    except Exception as e:
        print(f"Menu check failed: {e}")

    print("\nTesting /api/login...")
    student_data = {
        'username': 'john',
        'password': 'password123',
        'userType': 'student'
    }
    try:
        resp = requests.post(f'{base_url}/login', json=student_data)
        print(f"Status: {resp.status_code}")
        print(f"Body: {resp.text[:200]}")
    except Exception as e:
        print(f"Login check failed: {e}")

if __name__ == "__main__":
    test_server()
