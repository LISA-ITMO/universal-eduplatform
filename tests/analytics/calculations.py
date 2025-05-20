import numpy as np
from statistics import median
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from tests import models as tests_models
from .models import StudentAnalyticsTest, StudentLeadershipTest
from django.db.models import Q
from django.shortcuts import get_object_or_404

def convert_to_five_point_scale(rcv):
    """
    Convert a numeric value to a five-point scale.

    Args:
        rcv (int or float): Numeric value to convert.

    Returns:
        int: Converted value mapped to a five-point scale.
    """
    if rcv < 10:
        return 2
    elif rcv < 20:
        return 3
    elif rcv < 30:
        return 4
    else:
        return 5


def convert_analyticity_to_five_point_scale(analyticity_percentage):
    """
    Convert analyticity percentage to a five-point scale.

    Args:
        analyticity_percentage (float): Analyticity percentage value.

    Returns:
        int: Converted value mapped to a five-point scale.
    """
    if analyticity_percentage >= 75:
        return 5
    elif 50 <= analyticity_percentage < 75:
        return 4
    elif 30 <= analyticity_percentage < 50:
        return 3
    elif 20 <= analyticity_percentage < 30:
        return 2
    else:
        return 1


def calculate_analyticity_test(student_id, test_id):
    """
    Calculate analyticity score for a student on a specific test.

    Args:
        student_id (int): ID of the student.
        test_id (int): ID of the test.

    Returns:
        int or Error: Calculated analyticity score mapped to a five-point scale,
                    or ValidationError if calculation could not be performed.
    """

    # Getting the maximum score on a test
    test = get_object_or_404(tests_models.Test, pk=test_id)
    total_max_points = test.max_points
    # Receive student test scores
    result = tests_models.Result.objects.filter(id_user=student_id, id_test=test_id).first()
    score = result.score
    if total_max_points == 0:
        raise ValidationError("Invalid data")

    # Calculate the percentage of analyticity and convert it to a five-point scale
    analyticity_test = int((score / total_max_points) * 100)

    return analyticity_test

def calculate_analyticity_theme(student_id, theme_id, subject_id):
    tests = list(tests_models.Test.objects.filter(theme_id=theme_id).filter(subject_id=subject_id).values_list('id', flat=True))
    analyticyty_for_tests = list(StudentAnalyticsTest.objects.filter(student_id=student_id).filter(test_id__in=tests).values_list('analyticity_test', flat=True))
    analyticyty_for_theme = median(analyticyty_for_tests)
    return analyticyty_for_theme

def calculate_analyticity_course(student_id, subject_id):
    tests = list(tests_models.Test.objects.filter(subject_id=subject_id).values_list('id', flat=True))
    analyticyty_for_tests = list(StudentAnalyticsTest.objects.filter(student_id=student_id).filter(test_id__in=tests).values_list('analyticity_test', flat=True))
    analyticyty_for_course = median(analyticyty_for_tests)
    return analyticyty_for_course

def calculate_leadership_test(test_id): 
    test = get_object_or_404(tests_models.Test, pk=test_id)
    scores = sorted(list(StudentAnalyticsTest.objects.filter(test=test).values_list('analyticity_test', flat=True)))
    if len(scores) < 4:
        return 0
    scores_new = [score for score in scores if (score != 0 and score != scores[-1])]
    # Convert leadership to a five-point scale
    leadership = int(len(scores_new)/len(scores)*100)

    return leadership

def calculate_leadership_theme(student_id, theme_id, subject_id): 
    tests = list(tests_models.Test.objects.filter(theme_id=theme_id).filter(subject_id=subject_id).values_list('id', flat=True))
    leadership_for_tests = list(StudentLeadershipTest.objects.filter(student_id=student_id).filter(test_id__in=tests).values_list('leadership_test', flat=True))
    if len(leadership_for_tests) == 0:
        return 0
    leadership_for_theme = int(sum(leadership_for_tests)/len(leadership_for_tests))
    return leadership_for_theme

def calculate_leadership_course(student_id, subject_id): 
    tests = list(tests_models.Test.objects.filter(subject_id=subject_id).values_list('id', flat=True))
    leadership_for_tests = list(StudentLeadershipTest.objects.filter(student_id=student_id).filter(test_id__in=tests).values_list('leadership_test', flat=True))
    if len(leadership_for_tests) == 0:
        leadership_for_course = 0
        return leadership_for_course
    leadership_for_course = int(sum(leadership_for_tests)/len(leadership_for_tests))
    return leadership_for_course
