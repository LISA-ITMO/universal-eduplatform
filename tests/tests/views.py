from rest_framework import status, generics, viewsets
from .models import Test, Question, Answer,Solutions, TestUser
from .serializers import (TestSerializer,
                          QuestionSerializer,
                          AnswerSerializer,
                          TestListSerializer,
                          TestGetSerializer,
                          CorrectAnswerSerializer,
                          GradeSerializer,
                          ResultsSerializer,
                          SolutionsSerializer,
                          SolutionsResultsSerializer,
                          TestUserSerializer)
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


class ResultsView(viewsets.ModelViewSet):
    serializer_class = ResultsSerializer

    @swagger_auto_schema(tags=["Result"])
    def add(self, request, *args, **kwargs):
        data = request.data
        user_id = data.get('idStudent')
        test_id = data.get('idTest')
        results = data.get('solutions', [])

        serializer = TestUserSerializer(data={'user_id':user_id, 'test_id':test_id})
        if serializer.is_valid():
            serializer.save()
        id_result = list(TestUser.objects.filter(user_id=user_id).filter(test_id=test_id).values_list('id', flat=True))[0]

        for result in results:
            result['id_result'] = id_result

        serializer = SolutionsResultsSerializer(data=results, many=True)
    
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(tags=["Result"])
    def list(self, request, *args, **kwargs):
        data = list(TestUser.objects.all().values())
        result_data = []
        for result in data:
            data_solutions = list(Solutions.objects.filter(id_result_id=result['id']).values('answer', 'correct_answer'))
            result_data.append(
                {
                    'id_result_id': result['id'], 
                    'idStudent': result['user_id'],
                    'idTest': result['test_id'],
                    'solutions': data_solutions
                }
            )

        serializer = ResultsSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def getByResultId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(id=kwargs['id']).values())
        result_data = []
        for result in data:
            data_solutions = list(Solutions.objects.filter(id_result_id=result['id']).values('answer', 'correct_answer'))
            result_data.append(
                {
                    'id_result_id': result['id'], 
                    'idStudent': result['user_id'],
                    'idTest': result['test_id'],
                    'solutions': data_solutions
                }
            )

        serializer = ResultsSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def getByStudentTestId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(test_id=kwargs['testId']).filter(user_id=kwargs['studentId']).values_list('id', flat = True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def getByStudentId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(user_id=kwargs['studentId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def getByTestId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(test_id=kwargs['testId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def fullStudentTestId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(test_id=kwargs['testId']).filter(user_id=kwargs['studentId']).values())
        result_data = []
        for result in data:
            data_solutions = list(Solutions.objects.filter(id_result_id=result['id']).values('answer', 'correct_answer'))
            result_data.append(
                {
                    'id_result_id': result['id'], 
                    'idStudent': result['user_id'],
                    'idTest': result['test_id'],
                    'solutions': data_solutions
                }
            )

        serializer = ResultsSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def fullStudentId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(user_id=kwargs['studentId']).values())
        result_data = []
        for result in data:
            data_solutions = list(Solutions.objects.filter(id_result_id=result['id']).values('answer', 'correct_answer'))
            result_data.append(
                {
                    'id_result_id': result['id'], 
                    'idStudent': result['user_id'],
                    'idTest': result['test_id'],
                    'solutions': data_solutions
                }
            )

        serializer = ResultsSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def fullTestId(self, request, *args, **kwargs):
        data = list(TestUser.objects.filter(test_id=kwargs['testId']).values())
        result_data = []
        for result in data:
            data_solutions = list(Solutions.objects.filter(id_result_id=result['id']).values('answer', 'correct_answer'))
            result_data.append(
                {
                    'id_result_id': result['id'], 
                    'idStudent': result['user_id'],
                    'idTest': result['test_id'],
                    'solutions': data_solutions
                }
            )

        serializer = ResultsSerializer(result_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

