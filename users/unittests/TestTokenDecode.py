from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class TokenDecodeTests(TestCase):
    """
    Tests for token decoding functionality."""

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
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def test_token_decode_success(self):
        """
        Tests successful decoding of a token.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(f"/api/token/decode/{self.token}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_decode_invalid_token(self):
        """
        Tests decoding an invalid token returns a 401 Unauthorized error."""
        invalid_token = "invalidtoken"
        response = self.client.get(f"/api/token/decode/{invalid_token}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
