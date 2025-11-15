import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000/api"

def get_auth_token(username="student_alice", password="student123"):
    """Get authentication token"""
    url = f"{BASE_URL}/login/"
    data = {
        "username": username,
        "password": password
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print(f"Login failed: {response.status_code}")
        print(response.json())
        return None

def test_update_lesson_progress(token, module_id=1, lesson_id=1):
    """Test updating lesson progress"""
    url = f"{BASE_URL}/student/modules/{module_id}/lessons/{lesson_id}/progress"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.post(url, headers=headers)
    
    print(f"Testing POST {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

def test_get_student_stats(token):
    """Test getting student stats"""
    url = f"{BASE_URL}/student/stats"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    
    print(f"Testing GET {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

if __name__ == "__main__":
    print("Testing Progress Update API")
    print("=" * 50)
    
    # Get auth token
    token = get_auth_token()
    if token:
        test_update_lesson_progress(token, 1, 1)
        test_get_student_stats(token)
    else:
        print("Failed to get authentication token")