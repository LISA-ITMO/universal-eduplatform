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

    @swagger_auto_schema(tags=["Result"])
    def add(self, request, *args, **kwargs):
        data = request.data
        id_user = data.get('id_user')
        id_test = data.get('id_test')
        points_user = data.get('points_user')
        results = data.get('solutions', [])

        serializer = TestUserSerializer(data={'id_user': id_user, 'id_test': id_test, 'points_user': points_user})
        if serializer.is_valid():
            serializer.save()
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
            
        return Response(result_data, status=status.HTTP_201_CREATED)
    @swagger_auto_schema(tags=["Result"])
    def list(self, request, *args, **kwargs):
        results = Result.objects.all()
        serializer = ResultsSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def getByResultId(self, request, *args, **kwargs):
        data = get_object_or_404(Result, pk=kwargs['id'])
        serializer = ResultsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def getByStudentTestId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_test=kwargs['testId']).filter(id_user=kwargs['studentId']).values_list('id', flat = True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def getByStudentId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_user=kwargs['studentId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def getByTestId(self, request, *args, **kwargs):
        data = list(Result.objects.filter(id_test=kwargs['testId']).values_list('id', flat=True))
        return Response(data)
    
    @swagger_auto_schema(tags=["Result"])
    def fullStudentTestId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_test=kwargs['testId']).filter(id_user=kwargs['studentId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def fullStudentId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_user=kwargs['studentId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(tags=["Result"])
    def fullTestId(self, request, *args, **kwargs):
        data = Result.objects.filter(id_test=kwargs['testId'])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TestAPIView(viewsets.ModelViewSet):
    serializer_class = TestSerializer

    @swagger_auto_schema(tags=["Test"])

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

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class TestListView(viewsets.ModelViewSet):
    serializer_class = TestListSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(tags=["Test"])
    def get(self, request, *args, **kwargs):
        data = Test.objects.filter(subject_id=kwargs['subject_id']).filter(theme_id=kwargs['theme_id']).values()
        print(data)
        serializer = TestListSerializer(data, many=True)
        return Response(serializer.data)
        
class TestGetView(viewsets.ModelViewSet):
    serializer_class = TestGetSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(tags=["Test"])
    def get(self, request, *args, **kwargs):
        test_obj =  list(Test.objects.filter(pk=kwargs['pk']).values())
        if len(test_obj) == 0:
            return Response("test doesn't exist", status=status.HTTP_404_NOT_FOUND)
        test = test_obj[0]
        questions = list(Question.objects.filter(id_test=kwargs['pk']).values('pk'))
        result_data = {
                    'author_id': test['author_id'],
                    'subject_id': test['subject_id'],
                    'theme_id': test['theme_id'],
                    'expert_id': test['expert_id'],
                    'max_points': test['max_points'],
                    'questions': {},
                }
        for question in questions:
            answers = Answer.objects.filter(id_question=question['pk']).values('answer_text')
            data_answers = []
            for answer in answers:
                data_answers.append(answer['answer_text'])
            result_data['questions'][question['pk']] = data_answers
                
        return Response(result_data, status=status.HTTP_200_OK)
    
class GetAllCorrectAnswersView(viewsets.ModelViewSet):
    serializer_class = CorrectAnswerSerializer
    queryset = Question.objects.all()

    @swagger_auto_schema(tags=["Test"])

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

    @swagger_auto_schema(tags=["Test"])

    def get(self, request, *args, **kwargs):
        answers = Answer.objects.filter(id_question=kwargs['question_pk']).filter(is_correct=True).values()
        serializer = AnswerAllSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
