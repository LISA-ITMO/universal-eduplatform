import requests
import unittest


class TestStudentAnalyticsAPI(unittest.TestCase):
    base_url = 'http://127.0.0.1:8000/api/'

    def test_retrieve_student_analytics(self):
        student_id = 1
        url = f'{self.base_url}analytics/{student_id}/'
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)

    def test_list_student_analytics(self):
        url = f'{self.base_url}analytics/list/'
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)

    def test_create_student_analytics(self):
        data = {'student_id': 1}
        url = f'{self.base_url}analytics/create/'
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 201)

    def test_update_student_analytics(self):
        data = {'student_id': 1, 'analyticity': 3, 'leadership': 4}
        url = f'{self.base_url}analytics/update/'
        response = requests.put(url, json=data)
        self.assertEqual(response.status_code, 200)

    def test_calculate_analyticity(self):
        data = {'student_id': 2, 'test_id': 2}
        url = f'{self.base_url}analytics/calculate_analyticity/'
        response = requests.patch(url, json=data)
        self.assertEqual(response.status_code, 200)

    def test_calculate_leadership(self):
        data = {'student_id': 1}
        url = f'{self.base_url}analytics/calculate_leadership/'
        response = requests.patch(url, json=data)
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
