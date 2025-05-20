from django.core.management.base import BaseCommand
from rest_framework.exceptions import ValidationError
from tests.models import Result
from analytics.views import (calculating_analyticity_test, calculating_analyticity_theme, calculating_analyticity_course,
                            calculating_leadership_test, calculating_leadership_theme, calculating_leadership_course)

class Command(BaseCommand):
    help = 'Calculates analyticity for all results'

    def handle(self, *args, **options):
        results = Result.objects.all()
        for result in results:
            id_user = result.id_user
            test = result.id_test
            id_test = test.pk
            calculating_analyticity_test(data={
                                        "student_id": id_user,
                                        "test_id": id_test
                                        })
            calculating_analyticity_theme(data={
                                        "student_id": id_user,
                                        "theme_id": test.theme_id,
                                        "subject_id": test.subject_id
                                        })
            calculating_analyticity_course(data={
                                        "student_id": id_user,
                                        "subject_id": test.subject_id
                                        })
            try:
                calculating_leadership_test(data={
                                        "student_id": test.author_id,
                                        "test_id": id_test
                                        })
            except ValidationError as e:
                print(f"Error calculating leadership for test {id_test}: {e}")
            try:
                calculating_leadership_theme(data={
                                        "student_id": test.author_id,
                                        "theme_id": test.theme_id,
                                        "subject_id": test.subject_id
                                        })
            except ValidationError as e:
                print(f"Error calculating leadership theme for student {test.author_id}, theme {test.theme_id}, subject {test.subject_id}: {e}")
            try:
                calculating_leadership_course(data={
                                        "student_id": test.author_id,
                                        "subject_id": test.subject_id
                                        })
            except ValidationError as e:
                print(f"Error calculating leadership course for student {test.author_id}, subject {test.subject_id}: {e}")