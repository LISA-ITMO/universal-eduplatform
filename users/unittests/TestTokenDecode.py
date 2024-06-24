from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class TokenDecodeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        self.token = str(RefreshToken.for_user(self.user).access_token)

    def test_token_decode_success(self):
        response = self.client.get(f'/api/token/decode/{self.token}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_decode_invalid_token(self):
        invalid_token = 'invalidtoken'
        response = self.client.get(f'/api/token/decode/{invalid_token}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)