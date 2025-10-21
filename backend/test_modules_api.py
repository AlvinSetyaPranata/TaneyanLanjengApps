#!/usr/bin/env python
"""
Test script to verify the modules overview API endpoint
Run this from the backend directory: python test_modules_api.py
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_login():
    """Login and get access token"""
    print("Testing login...")
    response = requests.post(
        f"{BASE_URL}/login",
        json={
            "username": "admin",
            "password": "admin123"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful!")
        return data.get('access_token')
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None

def test_modules_overview(token):
    """Test the modules overview endpoint"""
    print("\nTesting modules overview endpoint...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(
        f"{BASE_URL}/modules/overview",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Modules overview endpoint working!")
        print(f"\n📊 Response:")
        print(json.dumps(data, indent=2))
        print(f"\n📈 Summary:")
        print(f"  - Success: {data.get('success')}")
        print(f"  - Total modules: {data.get('count')}")
        if data.get('modules'):
            for module in data['modules']:
                print(f"  - {module['title']}: {len(module['lessons'])} lessons")
    else:
        print(f"❌ Modules overview failed: {response.status_code}")
        print(response.text)

def test_module_detail(token, module_id=1):
    """Test the module detail endpoint"""
    print(f"\nTesting module detail endpoint (ID: {module_id})...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(
        f"{BASE_URL}/modules/{module_id}/detail",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Module detail endpoint working!")
        print(f"\n📊 Response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"❌ Module detail failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Modules API Endpoints")
    print("=" * 60)
    
    # Test login
    token = test_login()
    
    if token:
        # Test modules overview
        test_modules_overview(token)
        
        # Test module detail
        test_module_detail(token, module_id=1)
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
    else:
        print("\n❌ Cannot proceed without access token")
