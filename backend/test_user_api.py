#!/usr/bin/env python
"""
Test script for User Profile API endpoints
Run this after starting the Django server with: python manage.py runserver
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def print_separator():
    print("\n" + "="*80 + "\n")

def test_login():
    """Test login and get access token"""
    print("Testing Login...")
    
    url = f"{BASE_URL}/login"
    data = {
        "username": "student_alice",
        "password": "student123"
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("Login successful!")
        print(f"User: {result['user']['full_name']}")
        return result['access_token']
    else:
        print(f"Login failed: {response.text}")
        return None

def test_get_profile(token):
    """Test getting user profile"""
    print("Testing Get Profile...")
    
    url = f"{BASE_URL}/user/profile"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("Profile retrieved successfully!")
        print(json.dumps(result, indent=2))
    else:
        print(f"Failed: {response.text}")

def test_update_profile(token):
    """Test updating user profile"""
    print("Testing Update Profile...")
    
    url = f"{BASE_URL}/user/profile/update"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "full_name": "Alice Johnson Updated",
        "institution": "Taneyan Lanjeng University - Updated"
    }
    
    response = requests.put(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("Profile updated successfully!")
        print(json.dumps(result, indent=2))
    else:
        print(f"Failed: {response.text}")

def test_change_password(token):
    """Test changing password"""
    print("Testing Change Password...")
    
    url = f"{BASE_URL}/user/password/change"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "current_password": "student123",
        "new_password": "newpassword123"
    }
    
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("Password changed successfully!")
        print(json.dumps(result, indent=2))
        
        # Test login with new password
        print("\nTesting login with new password...")
        login_data = {
            "username": "student_alice",
            "password": "newpassword123"
        }
        login_response = requests.post(f"{BASE_URL}/login", json=login_data)
        if login_response.status_code == 200:
            print("Login with new password successful!")
            
            # Change password back to original
            print("\nChanging password back to original...")
            change_back_data = {
                "current_password": "newpassword123",
                "new_password": "student123"
            }
            new_token = login_response.json()['access_token']
            headers["Authorization"] = f"Bearer {new_token}"
            requests.post(url, json=change_back_data, headers=headers)
            print("Password restored to original")
    else:
        print(f"Failed: {response.text}")

def main():
    """Run all tests"""
    print("="*80)
    print("User Profile API Tests")
    print("="*80)
    
    # Test 1: Login
    print_separator()
    token = test_login()
    
    if not token:
        print("Cannot proceed without valid token. Please ensure:")
        print("1. Django server is running (python manage.py runserver)")
        print("2. Database is seeded (python manage.py seed_data)")
        return
    
    # Test 2: Get Profile
    print_separator()
    test_get_profile(token)
    
    # Test 3: Update Profile
    print_separator()
    test_update_profile(token)
    
    # Test 4: Get Profile again to verify update
    print_separator()
    print("Verifying profile update...")
    test_get_profile(token)
    
    # Test 5: Change Password
    print_separator()
    test_change_password(token)
    
    print_separator()
    print("All tests completed!")
    print("="*80)

if __name__ == "__main__":
    main()
