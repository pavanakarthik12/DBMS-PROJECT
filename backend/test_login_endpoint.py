import requests
import json

BASE_URL = 'http://127.0.0.1:5000/api'

def test_login():
    print("Testing Admin Login...")
    try:
        response = requests.post(f'{BASE_URL}/login', json={
            'username': 'admin',
            'password': 'admin123'
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

    print("\nTesting Student Login...")
    try:
        response = requests.post(f'{BASE_URL}/login', json={
            'username': 'student',
            'password': 'student123'
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

    print("\nTesting Invalid Login...")
    try:
        response = requests.post(f'{BASE_URL}/login', json={
            'username': 'admin',
            'password': 'wrongpassword'
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_login()
