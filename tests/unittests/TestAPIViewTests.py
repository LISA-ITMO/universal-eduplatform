from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from tests.models import Test, Question, Answer, Result, Solutions
from django.urls import reverse


class TestAPIViewTests(TestCase):
    """
    Tests for the API View."""

    def setUp(self):
        """
        Sets up the API client for testing.

          This method initializes an instance of the APIClient class and assigns it to
          the self.client attribute, making it available for use in test methods.

          Parameters:
            None

          Returns:
            None
        """
        self.client = APIClient()

    def test_add_test(self):
        """
        Tests the creation of a new test via POST request.

            Args:
                None

            Returns:
                None
        """
        data = {
            "author_id": 1,
            "subject_id": 1,
            "theme_id": 1,
            "expert_id": 1,
            "max_points": 100,
            "questions": [
                {
                    "question_text": "Sample Question",
                    "answers": [{"answer_text": "Sample Answer", "is_correct": True}],
                }
            ],
        }
        response = self.client.post(reverse("test-add"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
