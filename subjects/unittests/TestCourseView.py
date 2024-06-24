from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Subject, Theme, Course


class CourseViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.subject = Subject.objects.create(name="Mathematics")
        self.course = Course.objects.create(name_course="Basic Math", id_subject=self.subject,
                                            description="Basic Math Course", id_expert=1)

    def test_add_course(self):
        data = {'name_course': 'Advanced Math', 'id_subject': self.subject.id, 'description': 'Advanced Math Course',
                'id_expert': 2}
        response = self.client.post('/api/courses/add/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_course(self):
        response = self.client.get(f'/api/courses/{self.course.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_courses(self):
        response = self.client.get('/api/courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_course(self):
        response = self.client.delete(f'/api/courses/delete/{self.course.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_by_subject_id(self):
        response = self.client.get(f'/api/courses/subject/{self.subject.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_expert_id(self):
        response = self.client.get(f'/api/courses/expert/{self.course.id_expert}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_expert_info(self):
        response = self.client.get(f'/api/courses/expert/{self.course.id_expert}/subject/{self.subject.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)