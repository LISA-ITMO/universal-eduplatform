import numpy as np
from statistics import median
from django.db.models import Sum
from rest_framework.exceptions import ValidationError
from tests import models as tests_models


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


def calculate_analyticity(student_id, test_id):
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
    test = tests_models.Solutions.objects.get(id_result_id=test_id)
    total_max_points = test.max_points
    # Receive student test scores
    results = tests_models.Result.objects.filter(id_user=student_id, id_test=test_id)
    total_points = results.aggregate(total=Sum('points_user'))['total']

    if total_max_points == 0:
        raise ValidationError("Invalid data")

    # Calculate the percentage of analyticity and convert it to a five-point scale
    analyticity_percentage = (total_points / total_max_points) * 100
    analyticity = convert_analyticity_to_five_point_scale(round(analyticity_percentage, 2))

    return analyticity


def calculate_leadership(id_student):
    """
    Calculate leadership score for a student based on their latest test.

    Args:
        id_student (int): ID of the student.

    Returns:
        int: Calculated leadership score mapped to a five-point scale.
    """

    # Retrieve the last test created by the author
    latest_test = tests_models.Test.objects.filter(author_id=id_student).latest('id')
    # Retrieving questions from the last test
    questions = tests_models.Question.objects.filter(id_test=latest_test)
    response_density = []

    # Retrieving the results of the last test
    results = tests_models.Result.objects.filter(id_test=latest_test)

    for result in results:
        total_correct_responses = 0
        total_responses = 0

        for question in questions:
            solutions = tests_models.Solutions.objects.filter(id_result=result, id_question=question)
            # Receiving decisions on a question
            correct_responses = sum(1 for solution in solutions if
                                    solution.user_answer == solution.id_question.answers.get(
                                        is_correct=True).answer_text)
            total_correct_responses += correct_responses
            total_responses += solutions.count()
        # If there are responses, calculate the density of responses
        if total_responses > 0:
            element_ratio = round(total_correct_responses / total_responses, 2)
            response_density.append(element_ratio)

    if not response_density:
        leadership = 0
    else:
        # Calculate median value and interquartile range
        median_value = median(response_density)
        iqr = round(np.percentile(response_density, 75) - np.percentile(response_density, 25), 2)

        if median_value == 0 or iqr == 0:
            leadership = 0
        else:
            leadership = round(iqr / median_value, 2) * 100

    # Convert leadership to a five-point scale
    leadership = convert_to_five_point_scale(leadership)

    return leadership
