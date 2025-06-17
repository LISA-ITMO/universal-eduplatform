from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class LogoutAPIViewTests(TestCase):
    """
    Tests for the Logout API View."""

    def setUp(self):
        """
        Sets up the test environment with a client, user, and token.

            Creates an API client instance, a test user in the database,
            and generates an access token for that user. These are stored as
            instance attributes for use in subsequent tests.

            Parameters:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword", email="test@example.com"
        )
        self.token = RefreshToken.for_user(self.user).access_token

    def test_logout(self):
        """
        Logs out the current user and asserts a 204 No Content response.

            Args:
                None

            Returns:
                None
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.post("/api/logout/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
