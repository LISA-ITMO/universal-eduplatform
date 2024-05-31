from rest_framework import serializers
from .models import Test, Question, Solutions, Answer, Result


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct']

class AnswerAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text','addition_info', 'question_points', 'answers']

class QuestionAllAnswersSerializer(serializers.ModelSerializer):
    answers = AnswerAllSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text','addition_info', 'question_points', 'answers']

class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = ['id', 'author_id', 'subject_id', 'theme_id', 'expert_id', 'max_points', 'questions']


class TestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'author_id', 'subject_id', 'theme_id', 'times_solved', 'expert_id', 'max_points']


class TestGetSerializer(serializers.ModelSerializer):
    questions = QuestionAllAnswersSerializer(many=True)

    class Meta:
        model = Test
        fields = ['id', 'author_id', 'subject_id', 'theme_id', 'expert_id', 'max_points', 'questions']


class CorrectAnswerSerializer(serializers.Serializer):
    correct_answers = AnswerSerializer(many=True)
    id_question = serializers.IntegerField()

class TestUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = "__all__"

class SolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solutions
        fields = ['id_question', 'user_answer']

class ResultsSerializer(serializers.ModelSerializer):
    solutions = SolutionsSerializer(many=True)
    class Meta:
        model = Result
        fields = ['id', 'id_user', 'id_test', 'subject', 'theme', 'points_user', 'solutions']

class SolutionsResultsSerializer(serializers.ModelSerializer):
    class Meta:
            model = Solutions
            fields = "__all__"


