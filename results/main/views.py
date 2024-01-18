from django.shortcuts import get_object_or_404, render
from .models import Student, Test, Results, Question, Answer
from django.db.models import F


def grade_question(request, test_id, question_id):
    question = get_object_or_404(Question, pk=question_id)
    test = get_object_or_404(Test, pk=test_id)
    correct_answer = question.correct_answer()
    user_answer = question.answer_set.get(pk=request.POST['answer'])
    is_correct = correct_answer == user_answer
    answer_student = Answer(student=request.student, question=question, answer=user_answer,
                            is_correct=is_correct)
    answer_student.save()
    result, created = Results.objects.get_or_create(student=request.student, test=test)
    if is_correct is True:
        result.point = F('point') + 5
    result.save()
    return render(request,'')


def test_results(request, test_id):
    results = Results.objects.filter(student=request.student, test=request.test).values()
    pont = [i['point'] for i in results][0]
    return render(request,'')