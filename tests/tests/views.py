from rest_framework import status, generics, viewsets
from .models import Test, Question, Answer,Solutions, Result
from .serializers import (TestSerializer,
                          QuestionSerializer,
                          AnswerSerializer,
                          TestListSerializer,
                          TestGetSerializer,
                          CorrectAnswerSerializer,
                          ResultsSerializer,
                          SolutionsResultsSerializer,
                          TestUserSerializer,
                          AnswerAllSerializer,
                          SolutionsSerializer)
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

class ResultsView(viewsets.ModelViewSet):
    serializer_class = ResultsSerializer

    @swagger_auto_schema(tags=["Result"], operation_description="add student's result")
    def add(self, request, *args, **kwargs):
        data = request.data
        id_user = data.get('id_user')
        id_test = data.get('id_test')
        points_user = data.get('points_user')
        results = data.get('solutions', [])

        serializer = TestUserSerializer(data={'id_user': id_user, 'id_test': id_test, 'points_user': points_user})
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        id_result = list(Result.objects.filter(id_user=id_user).filter(id_test=id_test).values_list('id', flat=True))[-1]

        result_data = []
        for result in results:
            result['id_result'] = id_result
            serializer = SolutionsResultsSerializer(data=result)
            if serializer.is_valid():
                serializer.save()
                result_data.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({"message": "Added Sucessfully",  "status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
            
    @swagger_auto_schema(tags=["Result"], operation_description="get all results in database")
    def list(self, request, *args, **kwargs):
        results = Result.objects.all()
        serializer = ResultsSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve a result by id")
    def getByResultId(self, request, *args, **kwargs):
        data = get_object_or_404(Result, pk=kwargs['id'])
        serializer = ResultsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"],  operation_description="retrieve all student's results (IDs) for a test")
    def getByStudentTestId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_test=kwargs['testId']).filter(id_user=kwargs['studentId']).values_list('id', flat = True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve all student's results (IDs)")
    def getByStudentId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_user=kwargs['studentId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve all results (IDs) for a test")
    def getByTestId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_test=kwargs['testId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve all student's solutions for a test")
    def fullStudentTestId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_test=kwargs['testId']).filter(id_user=kwargs['studentId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve all student's solutions for all tests")
    def fullStudentId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_user=kwargs['studentId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"], operation_description="retrieve all solutions for a test")
    def fullTestId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_test=kwargs['testId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TestAPIView(viewsets.ModelViewSet):
    serializer_class = TestSerializer

    @swagger_auto_schema(tags=["Test"], operation_description="creates a test")

    def add(self, request, *args, **kwargs):
        data = request.data
        serializer = TestSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Create Test instance
        test_instance = Test.objects.create(
            author_id=data['author_id'],
            subject_id=data['subject_id'],
            theme_id=data['theme_id'],
            expert_id=data['theme_id'],
            max_points=data['max_points']
        )

        # Create Question and Answer instances
        for question_data in data['questions']:
            answers_data = question_data.pop('answers', [])

            question_instance = Question.objects.create(id_test=test_instance, **question_data)

            for answer_data in answers_data:
                Answer.objects.create(id_question=question_instance, **answer_data)

        return Response({"message": "Added Sucessfully",  "status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
    
class TestListView(viewsets.ModelViewSet):
    serializer_class = TestListSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(tags=["Test"], operation_description="retrieve a list of tests based on subject and theme IDs")
    def get(self, request, *args, **kwargs):
        data = Test.objects.filter(subject_id=kwargs['subject_id']).filter(theme_id=kwargs['theme_id']).values()
        print(data)
        serializer = TestListSerializer(data, many=True)
        return Response(serializer.data)
        
class TestGetView(viewsets.ModelViewSet):
    serializer_class = TestGetSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(tags=["Test"], operation_description="retrieve a test without correct answers")
    def get(self, request, *args, **kwargs):
        test =  get_object_or_404(Test, pk=kwargs['pk'])
        serializer = TestGetSerializer(test)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetAllCorrectAnswersView(viewsets.ModelViewSet):
    serializer_class = CorrectAnswerSerializer
    queryset = Question.objects.all()

    @swagger_auto_schema(tags=["Test"], operation_description="get correct answers for every question in a test")

    def get(self, request, *args, **kwargs):
        questions = Question.objects.filter(id_test=kwargs['pk'])

        correct_answers_data = []

        for question in questions:
            answers = Answer.objects.filter(id_question=question.pk).filter(is_correct=True).values()
            data_answers = [answer['answer_text'] for answer in answers]
            correct_answers_data.append({
                    'id_question': question.pk,
                    'correct_answers': data_answers,
                })

        return Response(correct_answers_data, status=status.HTTP_200_OK)

class GetAllCorrectAnswersByQuestionView(viewsets.ModelViewSet):
    serializer_class = AnswerAllSerializer

    @swagger_auto_schema(tags=["Test"], operation_description="get correct answers for a one question")

    def get(self, request, *args, **kwargs):
        answers = Answer.objects.filter(id_question=kwargs['question_pk']).filter(is_correct=True).values()
        serializer = AnswerAllSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
