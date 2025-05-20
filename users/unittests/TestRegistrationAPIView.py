from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class RegistrationAPIViewTests(TestCase):
    """
    Tests for the Registration API View."""

    def setUp(self):
        """
        Sets up the API client for testing.

          This method initializes an instance of the APIClient class and assigns it to
          the self.client attribute, making it available for use in test methods.

          Args:
            None

          Returns:
            None
        """
        self.client = APIClient()

    def test_register_user(self):
        """
        Tests the user registration endpoint."""
        data = {
            "username": "newuser",
            "password": "newpassword",
            "email": "newuser@example.com",
        }
        response = self.client.post("/api/register/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())
