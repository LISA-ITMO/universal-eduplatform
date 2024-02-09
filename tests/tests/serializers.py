from rest_framework import serializers
from .models import Test, Answer, Question, Grade, TestUser, Solutions


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_text']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['question_text', 'correct_answer', 'addition_info', 'answers']


class QuestionWithoutRightAnswerSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['question_text', 'addition_info', 'answers']


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = ['author_id', 'subject_id', 'theme_id', 'expert_id', 'questions']


class TestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'author_id', 'subject_id', 'theme_id', 'times_solved', 'expert_id']


class TestGetSerializer(serializers.ModelSerializer):
    questions = QuestionWithoutRightAnswerSerializer(many=True)

    class Meta:
        model = Test
        fields = ['author_id', 'subject_id', 'theme_id', 'expert_id', 'questions']


class CorrectAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    correct_answer = serializers.CharField()

class TestUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestUser
        fields = "__all__"

class SolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solutions
        fields = ['answer', 'correct_answer']

class ResultsSerializer(serializers.ModelSerializer):
    idStudent = serializers.IntegerField()
    idTest = serializers.IntegerField()
    solutions = SolutionsSerializer(many=True)
    class Meta:
        model = Solutions
        fields = ['id_result_id', 'idStudent', 'idTest', 'solutions']

class SolutionsResultsSerializer(serializers.ModelSerializer):
    class Meta:
            model = Solutions
            fields = "__all__"

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['user_id', 'test_id', 'question_id', 'answer']

