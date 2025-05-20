from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserAPIViewTests(TestCase):
    """
    Tests for the User API view."""

    def setUp(self):
        """
        Sets up test clients and users.

            Creates an API client, superuser (admin), regular user (teacher),
            and another regular user (student). Also generates authentication tokens
            for each user.

            Args:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="admin", password="adminpassword", email="admin@example.com"
        )
        self.teacher_user = User.objects.create_user(
            username="teacher", password="teacherpassword", email="teacher@example.com"
        )
        self.student_user = User.objects.create_user(
            username="student", password="studentpassword", email="student@example.com"
        )
        self.admin_token = RefreshToken.for_user(self.admin_user).access_token
        self.teacher_token = RefreshToken.for_user(self.teacher_user).access_token
        self.student_token = RefreshToken.for_user(self.student_user).access_token

    def test_admin_access(self):
        """
        Tests that admin users have access to the /api/user/admin endpoint.

            Args:
                None

            Returns:
                None
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.get("/api/user/admin/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teacher_access(self):
        """
        Tests that a teacher can access their own user information.

            Args:
                None

            Returns:
                None
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.teacher_token}")
        response = self.client.get("/api/user/teacher/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_access(self):
        """
        Tests that a student user can access their profile information.

            Args:
                None

            Returns:
                None
        """
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.student_token}")
        response = self.client.get("/api/user/student/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
