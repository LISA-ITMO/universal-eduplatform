from .models import Test, Question, Answer,Solutions, Result

def formula_1(id_result):
    result = Result.objects.get(pk=id_result)
    questions = Question.objects.filter(id_test=result.id_test)
    points_total = 0
    for question in questions:
        points_question = 0
        correct_answers = [answer.answer_text for answer in Answer.objects.filter(id_question=question.pk, is_correct=True)]
        num_right =  len(correct_answers)
        num_all = Answer.objects.filter(id_question=question.pk).count()
        print(num_all, num_right)
        solutions = Solutions.objects.filter(id_result=id_result, id_question=question.pk)
        for solution in solutions:
            if solution.user_answer in correct_answers:
                points_question += 1/num_right
            else:
                points_question -= 1/num_all
        points_question *= question.question_points
        points_question = round(points_question, 2)
        points_total += points_question
    return points_total