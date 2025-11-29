import requests
import json

def test_login():
    url = 'http://127.0.0.1:5000/api/login'
    
    # Test Admin Login
    admin_data = {
        'email': 'admin',
        'password': 'admin123',
        'userType': 'admin'
    }
    
    try:
        print("Testing Admin Login...")
        response = requests.post(url, json=admin_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Admin login failed: {e}")
        
    print("-" * 20)
    
    # Test Student Login
    student_data = {
        'email': 'john@example.com',
        'password': 'password123',
        'userType': 'student'
    }
    
    try:
        print("Testing Student Login...")
        response = requests.post(url, json=student_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Student login failed: {e}")

if __name__ == "__main__":
    test_login()
