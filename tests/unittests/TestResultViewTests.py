from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from tests.models import Test, Question, Answer, Result, Solutions
from django.urls import reverse


class ResultsViewTests(TestCase):
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
        self.result = Result.objects.create(id_user=1, id_test=self.test.id, points_user=0)
        self.solution = Solutions.objects.create(id_result=self.result, id_question=self.question,
                                                 id_answer=self.answer)

    def test_add_result(self):
        data = {
            'id_user': 1,
            'id_test': self.test.id,
            'subject': 'Math',
            'theme': 'Algebra',
            'solutions': [{
                'id_question': self.question.id,
                'id_answer': self.answer.id
            }]
        }
        response = self.client.post(reverse('results-add'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_results(self):
        response = self.client.get(reverse('results-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_result_id(self):
        response = self.client.get(reverse('results-get-by-id', kwargs={'id': self.result.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_student_test_id(self):
        response = self.client.get(
            reverse('results-get-by-student-test-id', kwargs={'testId': self.test.id, 'studentId': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_student_id(self):
        response = self.client.get(reverse('results-get-by-student-id', kwargs={'studentId': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_test_id(self):
        response = self.client.get(reverse('results-get-by-test-id', kwargs={'testId': self.test.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_full_student_test_id(self):
        response = self.client.get(
            reverse('results-full-student-test-id', kwargs={'testId': self.test.id, 'studentId': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_full_student_id(self):
        response = self.client.get(reverse('results-full-student-id', kwargs={'studentId': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_full_test_id(self):
        response = self.client.get(reverse('results-full-test-id', kwargs={'testId': self.test.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)


if __name__ == '__main__':
    ResultsViewTests()
