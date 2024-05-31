from django.db.models import Count, F
from tests.models import Test, Question, Result, Solutions, StudentAnalytics
from statistics import median
import numpy as np


def convert_to_five_point_scale(rcv):
    if rcv < 10:
        return 2
    elif rcv < 20:
        return 3
    elif rcv < 30:
        return 4
    else:
        return 5


def convert_analyticity_to_five_point_scale(analyticity_percentage):
    if analyticity_percentage >= 90:
        return 5
    elif 80 <= analyticity_percentage < 90:
        return 4
    elif 70 <= analyticity_percentage < 80:
        return 3
    elif 60 <= analyticity_percentage < 70:
        return 2
    else:
        return 1


def calculate_analyticity(id_student):
    test_results = Result.objects.filter(id_user=id_student)
    total_points = 0
    total_max_points = 0

    for result in test_results:
        test = result.id_test
        questions = Question.objects.filter(id_test=test)
        user_answers = Solutions.objects.filter(id_result=result)

        for user_answer in user_answers:
            question = questions.get(pk=user_answer.id_question_id)
            if user_answer.user_answer == user_answer.correct_answer:
                total_points += 1

        total_max_points += questions.count()

    if total_max_points == 0:
        analyticity = 0
    else:
        analyticity = round((total_points / total_max_points) * 100, 2)

    analyticity_five_point_scale = convert_analyticity_to_five_point_scale(analyticity)

    StudentAnalytics.objects.update_or_create(
        student_id=id_student,
        defaults={'analyticity': analyticity_five_point_scale}
    )


def calculate_leadership(id_student):
    test_results = Result.objects.filter(id_user=id_student)
    response_density = []

    for result in test_results:
        solutions = Solutions.objects.filter(id_result=result)
        responses = [1 if solution.user_answer == solution.correct_answer else 0 for solution in solutions]
        element_ratio = round(sum(responses) / len(responses), 2)
        response_density.append(element_ratio)

    if not response_density:
        leadership = 0
    else:
        median_value = median(response_density)
        iqr = round(np.percentile(response_density, 75) - np.percentile(response_density, 25), 2)

        if median_value == 0 or iqr == 0:
            leadership = 0
        else:
            leadership = round(iqr / median_value, 2) * 100
            leadership = convert_to_five_point_scale(leadership)

    StudentAnalytics.objects.update_or_create(
        student_id=id_student,
        defaults={'leadership': leadership}
    )
