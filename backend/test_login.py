# Test login credentials
import requests
import json

base_url = "http://localhost:5000/api"

# Test admin login
print("Testing Admin Login...")
admin_data = {
    "email": "admin",
    "password": "admin123",
    "userType": "admin"
}

try:
    response = requests.post(f"{base_url}/login", json=admin_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
except Exception as e:
    print(f"Error: {e}")
    print()

# Test student login
print("Testing Student Login...")
student_data = {
    "email": "rajesh@email.com",
    "password": "student123",
    "userType": "student"
}

try:
    response = requests.post(f"{base_url}/login", json=student_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
