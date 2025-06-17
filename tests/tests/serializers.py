from rest_framework import serializers
from .models import Test, Question, Solutions, Answer, Result


class AnswerSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Answer
        fields = ["id", "answer_text", "is_correct"]


class AnswerAllSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = Answer
        fields = ["id", "answer_text"]


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializes question data."""

    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "question_text", "addition_info", "question_points", "answers"]


class QuestionAllAnswersSerializer(serializers.ModelSerializer):
    """
    Serializes all answers for a given question."""

    answers = AnswerAllSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "question_text", "addition_info", "question_points", "answers"]


class TestSerializer(serializers.ModelSerializer):
    """
    Tests the serialization and deserialization of data."""

    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = [
            "id",
            "author_id",
            "subject_id",
            "theme_id",
            "expert_id",
            "max_points",
            "questions",
        ]


class TestListSerializer(serializers.ModelSerializer):
    """
    Tests serialization and deserialization of lists.

    This class provides methods to serialize a list of numbers into a list of strings,
    and deserialize a list of strings back into a list of integers. It includes error handling for invalid input during deserialization.
    """

    class Meta:
        model = Test
        fields = [
            "id",
            "author_id",
            "subject_id",
            "theme_id",
            "times_solved",
            "expert_id",
            "max_points",
        ]


class TestGetSerializer(serializers.ModelSerializer):
    """
    Tests the GetSerializer class."""

    questions = QuestionAllAnswersSerializer(many=True)

    class Meta:
        model = Test
        fields = [
            "id",
            "author_id",
            "subject_id",
            "theme_id",
            "expert_id",
            "max_points",
            "questions",
        ]


class CorrectAnswerSerializer(serializers.Serializer):
    """
    Serializes and potentially deserializes correct answer data.

        This class is designed to handle the conversion of correct answers
        to a format suitable for storage or transmission, and vice-versa.
        It likely interacts with a model representing correct answers and
        a question ID.
    """

    correct_answers = serializers.ListField()
    id_question = serializers.IntegerField()


class TestUserSerializer(serializers.ModelSerializer):
    """
    Tests for the User Serializer."""

    class Meta:
        model = Result
        fields = "__all__"


class SolutionsSerializer(serializers.ModelSerializer):
    """
    Serializes solutions data for API representation.

        This class handles the conversion of solution objects into a format suitable
        for transmission over an API, typically JSON. It provides methods to
        represent solution details in a structured and consistent manner.
    """

    class Meta:
        model = Solutions
        fields = ["id_question", "user_answer"]


class ResultsSerializer(serializers.ModelSerializer):
    """
    Serializes and potentially transforms results data."""

    solutions = SolutionsSerializer(many=True)

    class Meta:
        model = Result
        fields = [
            "id",
            "id_user",
            "id_test",
            "subject",
            "theme",
            "points_user",
            "solutions",
        ]


class SolutionsResultsSerializer(serializers.ModelSerializer):
    """
    Serializes solutions results for various output formats.

        This class handles the conversion of solution results data into different
        representations, such as JSON or other custom formats, suitable for
        reporting or storage.
    """

    class Meta:
        model = Solutions
        fields = "__all__"
