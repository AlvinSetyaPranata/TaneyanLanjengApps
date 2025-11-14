import requests
import json

# Base URL for the API - Updated to match the correct backend port
BASE_URL = "http://localhost:8000/api"

def test_get_modules_overview():
    """Test getting modules overview"""
    url = f"{BASE_URL}/modules/overview"
    response = requests.get(url)
    
    print(f"Testing GET {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

def test_get_module_detail(module_id=1):
    """Test getting module detail"""
    url = f"{BASE_URL}/modules/{module_id}/detail"
    response = requests.get(url)
    
    print(f"Testing GET {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

def test_get_lesson_detail(module_id=1, lesson_id=1):
    """Test getting lesson detail"""
    url = f"{BASE_URL}/modules/{module_id}/lessons/{lesson_id}"
    response = requests.get(url)
    
    print(f"Testing GET {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)

if __name__ == "__main__":
    print("Testing Modules API")
    print("=" * 50)
    
    test_get_modules_overview()
    test_get_module_detail()
    test_get_lesson_detail()