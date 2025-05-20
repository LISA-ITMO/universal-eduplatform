from django.db import models
from django.utils import timezone


class Test(models.Model):
    author_id = models.IntegerField(null=False, blank=False)
    subject_id = models.IntegerField(null=False, blank=False)
    theme_id = models.IntegerField(null=False, blank=False)
    times_solved = models.IntegerField(default=0, null=False, blank=False)
    expert_id = models.IntegerField(default=0, null=False, blank=False)
    max_points = models.IntegerField(default=0, null=False, blank=False)

    class Meta:
        app_label = 'tests'


class Question(models.Model):
    id_test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=100, null=False, blank=False)
    addition_info = models.TextField(null=False, blank=False)
    question_points = models.IntegerField(default=1, null=False, blank=False)

    class Meta:
        app_label = 'tests'


class Answer(models.Model):
    answer_text = models.TextField(null=False, blank=False)
    id_question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    is_correct = models.BooleanField()

    class Meta:
        app_label = 'tests'


class Result(models.Model):
    id_user = models.IntegerField(null=False, blank=False)
    id_test = models.ForeignKey(Test, on_delete=models.CASCADE)
    subject = models.TextField(null=False, blank=False)
    theme = models.TextField(null=False, blank=False)
    points_user = models.IntegerField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    passing_date = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        app_label = 'tests'


class Solutions(models.Model):
    id_result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name='solutions')
    id_question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_answer = models.IntegerField(null=False, blank=False)

    class Meta:
        app_label = 'tests'