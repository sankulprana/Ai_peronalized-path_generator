"""
Simple test script for the Learning Path Generator API
Run this after starting the Flask server to test all endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_register():
    """Test learner registration"""
    print("\n1. Testing /register endpoint...")
    data = {
        "fullName": "Test User",
        "age": 22,
        "educationLevel": "Bachelor's Degree",
        "currentDomain": "web-development",
        "careerGoal": "Become a full-stack developer",
        "experienceLevel": "intermediate",
        "learningStyle": "video",
        "weeklyStudyHours": 10
    }
    
    response = requests.post(f"{BASE_URL}/register", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    
    if result.get('success'):
        return result.get('userId')
    return None

def test_assessment(user_id):
    """Test skill assessment submission"""
    print("\n2. Testing /assessment endpoint...")
    data = {
        "userId": user_id,
        "skills": [
            {"name": "JavaScript", "level": 3},
            {"name": "React", "level": 2},
            {"name": "Node.js", "level": 1},
            {"name": "Database Design", "level": 2}
        ]
    }
    
    response = requests.post(f"{BASE_URL}/assessment", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('success', False)

def test_generate_path(user_id):
    """Test learning path generation"""
    print("\n3. Testing /generate-path endpoint...")
    data = {
        "userId": user_id
    }
    
    response = requests.post(f"{BASE_URL}/generate-path", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('success', False)

def test_dashboard(user_id):
    """Test dashboard data retrieval"""
    print("\n4. Testing /dashboard/<user_id> endpoint...")
    
    response = requests.get(f"{BASE_URL}/dashboard/{user_id}")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('success', False)

def test_update_progress(user_id):
    """Test progress update"""
    print("\n5. Testing /update-progress endpoint...")
    data = {
        "userId": user_id,
        "skillProgress": [
            {"name": "JavaScript", "progress": 75},
            {"name": "React", "progress": 45}
        ],
        "courseProgress": [
            {"title": "Complete JavaScript Course 2024", "progress": 60},
            {"title": "React - The Complete Guide", "progress": 30}
        ]
    }
    
    response = requests.post(f"{BASE_URL}/update-progress", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('success', False)

def main():
    """Run all tests"""
    print("=" * 50)
    print("Learning Path Generator API Test Suite")
    print("=" * 50)
    print("\nMake sure the Flask server is running on http://localhost:5000")
    
    try:
        # Test home endpoint
        print("\n0. Testing / endpoint...")
        response = requests.get(BASE_URL)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Test registration
        user_id = test_register()
        if not user_id:
            print("\n❌ Registration failed. Stopping tests.")
            return
        
        # Test assessment
        if not test_assessment(user_id):
            print("\n⚠️ Assessment test failed, but continuing...")
        
        # Test path generation
        if not test_generate_path(user_id):
            print("\n⚠️ Path generation test failed, but continuing...")
        
        # Test dashboard
        if not test_dashboard(user_id):
            print("\n⚠️ Dashboard test failed, but continuing...")
        
        # Test progress update
        if not test_update_progress(user_id):
            print("\n⚠️ Progress update test failed, but continuing...")
        
        # Test dashboard again after progress update
        print("\n6. Testing /dashboard/<user_id> after progress update...")
        test_dashboard(user_id)
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the server.")
        print("Make sure Flask server is running: python app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()

