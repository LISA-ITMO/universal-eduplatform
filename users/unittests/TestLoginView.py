from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User


class LoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com',
                                             is_active=True)

    def test_login_success(self):
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post('/api/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_login_invalid_credentials(self):
        data = {'username': 'wronguser', 'password': 'wrongpassword'}
        response = self.client.post('/api/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_inactive_user(self):
        self.user.is_active = False
        self.user.save()
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post('/api/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
