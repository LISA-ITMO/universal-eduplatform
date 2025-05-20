from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from tests.models import Test, Question, Answer, Result, Solutions
from django.urls import reverse


class TestListViewTests(TestCase):
    """
    Base class for testing the Test List View API."""

    def setUp(self):
        """
        Sets up the test environment by creating an API client and a Test object.

            Args:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.test = Test.objects.create(
            author_id=1, subject_id=1, theme_id=1, expert_id=1, max_points=100
        )

    def test_get_tests(self):
        """
        Tests the retrieval of tests for a given subject and theme.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(
            reverse("test-list", kwargs={"subject_id": 1, "theme_id": 1})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_test(self):
        """
        Tests the GET request for a specific test instance.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(reverse("test-get", kwargs={"pk": self.test.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
