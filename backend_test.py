import requests
import sys
import json
from datetime import datetime, timedelta

class CleaningServiceAPITester:
    def __init__(self, base_url="https://maid-meetup.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.user_id = None
        self.admin_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_detail = response.json().get('detail', 'No error detail')
                    details += f", Error: {error_detail}"
                except:
                    details += f", Response: {response.text[:100]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        user_data = {
            "name": f"Test User {timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "password": "TestPass123!"
        }
        
        response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            201,
            data=user_data
        )
        
        if response and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # Try to login with the registered user
        if not hasattr(self, 'user_email'):
            return False
            
        login_data = {
            "email": self.user_email,
            "password": "TestPass123!"
        }
        
        response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if response and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            self.log_test("Get Current User", False, "No token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            headers=headers
        )
        return response is not None

    def test_get_services(self):
        """Test getting services list"""
        response = self.run_test(
            "Get Services",
            "GET",
            "services",
            200
        )
        
        if response and isinstance(response, list) and len(response) > 0:
            self.services = response
            return True
        return False

    def test_create_booking(self):
        """Test creating a booking"""
        if not self.token or not hasattr(self, 'services'):
            self.log_test("Create Booking", False, "Missing token or services")
            return False
            
        # Use tomorrow's date
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        booking_data = {
            "service_id": self.services[0]['id'],
            "service_name": self.services[0]['name'],
            "booking_date": tomorrow,
            "booking_time": "10:00",
            "address": "123 Test Street, Test City, TC 12345",
            "phone": "(555) 123-4567",
            "notes": "Test booking notes"
        }
        
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            201,
            data=booking_data,
            headers=headers
        )
        
        if response and 'id' in response:
            self.booking_id = response['id']
            return True
        return False

    def test_get_user_bookings(self):
        """Test getting user's bookings"""
        if not self.token:
            self.log_test("Get User Bookings", False, "No token available")
            return False
            
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.run_test(
            "Get User Bookings",
            "GET",
            "bookings/user",
            200,
            headers=headers
        )
        return response is not None

    def test_admin_functionality(self):
        """Test admin-specific functionality"""
        # First, try to create an admin user by registering and then manually updating role
        timestamp = datetime.now().strftime('%H%M%S')
        admin_data = {
            "name": f"Admin User {timestamp}",
            "email": f"admin{timestamp}@example.com",
            "password": "AdminPass123!"
        }
        
        response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            201,
            data=admin_data
        )
        
        if response and 'access_token' in response:
            self.admin_token = response['access_token']
            self.admin_id = response['user']['id']
            
            # Note: In a real scenario, we'd need to manually update the user role in the database
            # For testing purposes, we'll try the admin endpoints and expect 403 errors
            
            headers = {'Authorization': f'Bearer {self.admin_token}'}
            
            # Test get all bookings (should fail with 403 since user is not admin)
            self.run_test(
                "Get All Bookings (Non-Admin)",
                "GET",
                "bookings/all",
                403,  # Expecting 403 since user is not admin
                headers=headers
            )
            
            return True
        return False

    def test_cancel_booking(self):
        """Test canceling a booking"""
        if not self.token or not hasattr(self, 'booking_id'):
            self.log_test("Cancel Booking", False, "Missing token or booking ID")
            return False
            
        headers = {'Authorization': f'Bearer {self.token}'}
        response = self.run_test(
            "Cancel Booking",
            "DELETE",
            f"bookings/{self.booking_id}",
            200,
            headers=headers
        )
        return response is not None

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        response = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,  # Expecting 401 for invalid credentials
            data=invalid_data
        )
        return response is None  # We expect this to fail

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting Cleaning Service API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test user registration and authentication
        if self.test_user_registration():
            # Store user email for login test
            timestamp = datetime.now().strftime('%H%M%S')
            self.user_email = f"testuser{timestamp}@example.com"
            
        self.test_get_current_user()
        self.test_invalid_login()
        
        # Test services
        self.test_get_services()
        
        # Test booking flow
        self.test_create_booking()
        self.test_get_user_bookings()
        
        # Test admin functionality
        self.test_admin_functionality()
        
        # Test booking cancellation
        self.test_cancel_booking()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = CleaningServiceAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())