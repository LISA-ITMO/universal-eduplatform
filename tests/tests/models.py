from django.db import models


class Test(models.Model):
    author_id = models.IntegerField(null=False, blank=False)
    subject_id = models.IntegerField(null=False, blank=False)
    theme_id = models.IntegerField(null=False, blank=False)
    times_solved = models.IntegerField(default=0, null=False, blank=False)
    expert_id = models.IntegerField(default=0, null=False, blank=False)


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=100, null=False, blank=False)
    correct_answer = models.CharField(max_length=100, null=False, blank=False)
    addition_info = models.TextField(null=False, blank=False)


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=100, null=False, blank=False)


class TestUser(models.Model):
    user_id = models.IntegerField(null=False, blank=False)
    test_id = models.IntegerField(null=False, blank=False)


class Grade(models.Model):
    user_id = models.IntegerField(null=False, blank=False)
    test_id = models.IntegerField(null=False, blank=False)
    question_id = models.IntegerField(null=False, blank=False)
    answer = models.CharField(max_length=255)

class Solutions(models.Model):
    user_id = models.IntegerField(null=False, blank=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    answer = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)