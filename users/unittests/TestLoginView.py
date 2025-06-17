from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User


class LoginViewTests(TestCase):
    """
    Tests for the login view."""

    def setUp(self):
        """
        Sets up the test environment by creating an API client and a user.

            This method is typically used as part of a testing framework to initialize
            resources needed for each test case. It creates an instance of the APIClient
            and a sample user with predefined credentials.

            Parameters:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test@example.com",
            is_active=True,
        )

    def test_login_success(self):
        """
        Tests a successful login request.

            Args:
                None

            Returns:
                None
        """
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post("/api/login/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    def test_login_invalid_credentials(self):
        """
        Tests login with invalid credentials."""
        data = {"username": "wronguser", "password": "wrongpassword"}
        response = self.client.post("/api/login/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_inactive_user(self):
        """
        Tests login with an inactive user."""
        self.user.is_active = False
        self.user.save()
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post("/api/login/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
