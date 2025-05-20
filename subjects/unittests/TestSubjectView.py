from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Subject, Theme, Course


class SubjectViewTests(TestCase):
    """
    Tests for the Subject API view."""

    def setUp(self):
        """
        Sets up the test environment by creating an API client and a Subject instance.

            Args:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.subject = Subject.objects.create(name="Mathematics")

    def test_list_subjects(self):
        """
        Tests the API endpoint for listing subjects.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get("/api/subjects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_subject(self):
        """
        Retrieves a subject by ID and asserts the response status code.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(f"/api/subjects/{self.subject.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_subject(self):
        """
        Tests the addition of a new subject via the API.

            Args:
                None

            Returns:
                None
        """
        data = {"name": "Physics"}
        response = self.client.post("/api/subjects/add/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_subject(self):
        """
        Deletes a subject via the API and asserts a successful response.

            Args:
                None

            Returns:
                None
        """
        response = self.client.delete(f"/api/subjects/delete/{self.subject.id}/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
