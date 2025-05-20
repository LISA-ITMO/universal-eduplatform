from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Subject, Theme, Course


class ThemeViewTests(TestCase):
    """
    Tests for the Theme API view."""

    def setUp(self):
        """
        Sets up the test environment with a client, subject, and theme.

            Creates an API client instance, a Subject object named "Mathematics",
            and a Theme object named "Algebra" associated with the created subject.

            Args:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.subject = Subject.objects.create(name="Mathematics")
        self.theme = Theme.objects.create(name="Algebra", id_subject=self.subject)

    def test_list_themes(self):
        """
        Tests the API endpoint for listing themes.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get("/api/themes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_theme(self):
        """
        Retrieves a theme by its ID and asserts the response status code.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(f"/api/themes/{self.theme.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_theme(self):
        """
        Tests the creation of a new theme via the API.

            Args:
                None

            Returns:
                None
        """
        data = {"name": "Geometry", "id_subject": self.subject.id}
        response = self.client.post("/api/themes/add/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_theme(self):
        """
        Deletes a theme via the API and asserts a successful response.

            Args:
                None

            Returns:
                None
        """
        response = self.client.delete(f"/api/themes/delete/{self.theme.id}/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_by_subject_id(self):
        """
        Tests retrieving a theme by its associated subject ID.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(f"/api/themes/subject/{self.subject.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
