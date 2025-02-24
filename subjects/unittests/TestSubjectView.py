from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Subject, Theme, Course


class SubjectViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.subject = Subject.objects.create(name="Mathematics")

    def test_list_subjects(self):
        response = self.client.get('/api/subjects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_subject(self):
        response = self.client.get(f'/api/subjects/{self.subject.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_subject(self):
        data = {'name': 'Physics'}
        response = self.client.post('/api/subjects/add/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_subject(self):
        response = self.client.delete(f'/api/subjects/delete/{self.subject.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
