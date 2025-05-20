from .models import Test, Question, Answer, Solutions, Result


def formula_1(id_result):
    """
    Calculates the total points for a given result based on questions and answers.

        Args:
            id_result: The primary key of the Result object to calculate points for.

        Returns:
            float: The total calculated points for the result, rounded to two decimal places.
    """
    result = Result.objects.get(pk=id_result)
    questions = Question.objects.filter(id_test=result.id_test)
    points_total = 0
    for question in questions:
        points_question = 0
        correct_answers = [
            answer.answer_text
            for answer in Answer.objects.filter(
                id_question=question.pk, is_correct=True
            )
        ]
        num_right = len(correct_answers)
        num_all = Answer.objects.filter(id_question=question.pk).count()
        solutions = Solutions.objects.filter(
            id_result=id_result, id_question=question.pk
        )
        for solution in solutions:
            if solution.user_answer in correct_answers:
                points_question += 1 / num_right
            else:
                points_question -= 1 / num_all
        points_question *= question.question_points
        points_question = round(points_question, 2)
        points_total += points_question
    return points_total
