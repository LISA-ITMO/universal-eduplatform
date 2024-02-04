from rest_framework import status, generics
from .models import Test, Question, Answer, Grade
from .serializers import (TestSerializer,
                          QuestionSerializer,
                          AnswerSerializer,
                          TestListSerializer,
                          TestGetSerializer,
                          CorrectAnswerSerializer,
                          GradeSerializer)
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404


class TestAddView(APIView):
    @swagger_auto_schema(tags=["Test"])
    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = TestSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Create Test instance
        test_instance = Test.objects.create(
            author_id=data['author_id'],
            subject_id=data['subject_id'],
            theme_id=data['theme_id']
        )

        # Create Question and Answer instances
        for question_data in data['questions']:
            answers_data = question_data.pop('answers', [])

            question_instance = Question.objects.create(test=test_instance, **question_data)

            for answer_data in answers_data:
                Answer.objects.create(question=question_instance, **answer_data)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


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


class GradeAPIView(APIView):
    @swagger_auto_schema(tags=["Result"])
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('user_id')
        test_id = data.get('test_id')
        results = data.get('results', [])

        for result in results:
            result['user_id'] = user_id
            result['test_id'] = test_id

        serializer = GradeSerializer(data=results, many=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllGradesAPIView(APIView):
    @swagger_auto_schema(tags=["Result"])
    def get(self, request, *args, **kwargs):
        grades = Grade.objects.all()
        serializer = GradeSerializer(grades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
