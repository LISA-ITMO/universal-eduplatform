from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from courses.models import Subject, Theme, Course


class ThemeViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.subject = Subject.objects.create(name="Mathematics")
        self.theme = Theme.objects.create(name="Algebra", id_subject=self.subject)

    def test_list_themes(self):
        response = self.client.get('/api/themes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_theme(self):
        response = self.client.get(f'/api/themes/{self.theme.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_theme(self):
        data = {'name': 'Geometry', 'id_subject': self.subject.id}
        response = self.client.post('/api/themes/add/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_theme(self):
        response = self.client.delete(f'/api/themes/delete/{self.theme.id}/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_by_subject_id(self):
        response = self.client.get(f'/api/themes/subject/{self.subject.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)