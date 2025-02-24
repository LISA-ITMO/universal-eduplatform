from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from tests.models import Test, Question, Answer, Result, Solutions
from django.urls import reverse


class GetAllCorrectAnswersViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.test = Test.objects.create(
            author_id=1,
            subject_id=1,
            theme_id=1,
            expert_id=1,
            max_points=100
        )
        self.question = Question.objects.create(id_test=self.test, question_text="Sample Question")
        self.answer = Answer.objects.create(id_question=self.question, answer_text="Sample Answer", is_correct=True)

    def test_get_correct_answers(self):
        response = self.client.get(reverse('correct-answers', kwargs={'pk': self.test.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_correct_answers_by_question(self):
        response = self.client.get(reverse('correct-answers-by-question', kwargs={'question_pk': self.question.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)