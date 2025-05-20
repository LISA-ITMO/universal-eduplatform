from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from tests.models import Test, Question, Answer, Result, Solutions
from django.urls import reverse


class GetAllCorrectAnswersViewTests(TestCase):
    """
    Unit tests for the GetAllCorrectAnswersView."""

    def setUp(self):
        """
        Sets up test fixtures for API tests.

            Creates an API client, a Test object, a Question object associated with the Test,
            and an Answer object associated with the Question. These objects are stored as
            instance attributes for use in subsequent test methods.

            Parameters:
                None

            Returns:
                None
        """
        self.client = APIClient()
        self.test = Test.objects.create(
            author_id=1, subject_id=1, theme_id=1, expert_id=1, max_points=100
        )
        self.question = Question.objects.create(
            id_test=self.test, question_text="Sample Question"
        )
        self.answer = Answer.objects.create(
            id_question=self.question, answer_text="Sample Answer", is_correct=True
        )

    def test_get_correct_answers(self):
        """
        Retrieves correct answers for a specific test and asserts the response status code.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(
            reverse("correct-answers", kwargs={"pk": self.test.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_correct_answers_by_question(self):
        """
        Tests retrieving correct answers for a specific question.

            Args:
                None

            Returns:
                None
        """
        response = self.client.get(
            reverse(
                "correct-answers-by-question", kwargs={"question_pk": self.question.id}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
