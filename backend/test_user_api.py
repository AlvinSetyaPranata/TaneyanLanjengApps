import requests
import json

# Base URL for the API - Updated to match the correct backend port
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

def test_user_profile(token):
    """Test the user profile endpoint"""
    print("\nTesting user profile endpoint...")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(
        f"{BASE_URL}/user/profile",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ User profile endpoint working!")
        print(f"\n📊 Response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"❌ User profile failed: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    print("=" * 60)
    print("Testing User API Endpoints")
    print("=" * 60)
    
    # Test login
    token = test_login()
    
    if token:
        # Test user profile
        test_user_profile(token)
        
        print("\n" + "=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
    else:
        print("\n❌ Cannot proceed without access token")