from rest_framework import status
from .models import Test, Question, Answer
from .serializers import (TestSerializer,
                          QuestionSerializer,
                          AnswerSerializer,
                          TestListSerializer,
                          TestGetSerializer,
                          CorrectAnswerSerializer)
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404


class TestAddView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = TestSerializer(data=data)

        if serializer.is_valid():
            test_instance = serializer.save()

            for question_data in data.get('questions', []):
                answers_data = question_data.pop('answers', [])
                question_serializer = QuestionSerializer(data=question_data)

                if question_serializer.is_valid():
                    question_instance = question_serializer.save(test=test_instance)

                    for answer_data in answers_data:
                        answer_serializer = AnswerSerializer(data=answer_data)

                        if answer_serializer.is_valid():
                            answer_serializer.save(question=question_instance)
                        else:
                            # Handle invalid answer data
                            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    # Handle invalid question data
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestListView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def get(self, request, *args, **kwargs):
        subject_id = request.GET.get('subject_id')
        theme_id = request.GET.get('theme_id')

        # Add any additional validation or error handling as needed
        if not subject_id or not theme_id:
            return Response({'error': 'Both subject_id and theme_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        tests = Test.objects.filter(subject_id=subject_id, theme_id=theme_id)
        serializer = TestListSerializer(tests, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TestGetView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def get(self, request, pk, *args, **kwargs):
        test = get_object_or_404(Test, pk=pk)
        serializer = TestGetSerializer(test)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllCorrectAnswersView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def get(self, request, pk, *args, **kwargs):
        test = get_object_or_404(Test, pk=pk)
        questions = Question.objects.filter(test=test)

        correct_answers_data = []

        for question in questions:
            correct_answers_data.append({
                'question_id': question.id,
                'correct_answer': question.correct_answer,
            })

        serializer = CorrectAnswerSerializer(correct_answers_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCorrectAnswerByQuestionIdView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def get(self, request, question_pk, *args, **kwargs):
        question = get_object_or_404(Question, pk=question_pk)

        correct_answer_data = {
            'correct_answer': question.correct_answer,
        }

        serializer = CorrectAnswerSerializer(correct_answer_data)

        return Response(serializer.data, status=status.HTTP_200_OK)
