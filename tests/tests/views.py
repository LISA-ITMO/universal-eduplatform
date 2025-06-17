from rest_framework import status, generics, viewsets
from .models import Test, Question, Answer, Solutions, Result
from .serializers import (
    TestSerializer,
    QuestionSerializer,
    AnswerSerializer,
    TestListSerializer,
    TestGetSerializer,
    CorrectAnswerSerializer,
    ResultsSerializer,
    SolutionsResultsSerializer,
    TestUserSerializer,
    AnswerAllSerializer,
    SolutionsSerializer,
)
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .calculations import formula_1


class ResultsView(viewsets.ModelViewSet):
    """
    View for managing student results."""

    serializer_class = ResultsSerializer

    @swagger_auto_schema(tags=["Result"], operation_description="add student's result")
    def add(self, request, *args, **kwargs):
        """
        Adds a student's result to the database.

            Args:
                request: The request object containing the data for the new result.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A response indicating success or failure, with status code.  On success returns a message and HTTP 201 Created status. On failure returns validation errors and HTTP 400 Bad Request status.
        """
        data = request.data
        id_user = data.get("id_user")
        id_test = data.get("id_test")
        subject = data.get("subject")
        theme = data.get("theme")
        results = data.get("solutions", [])

        serializer = TestUserSerializer(
            data={
                "id_user": id_user,
                "id_test": id_test,
                "subject": subject,
                "theme": theme,
            }
        )
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        id_result = list(
            Result.objects.filter(id_user=id_user)
            .filter(id_test=id_test)
            .values_list("id", flat=True)
        )[-1]

        result_data = []
        for result in results:
            result["id_result"] = id_result
            serializer = SolutionsResultsSerializer(data=result)
            if serializer.is_valid():
                serializer.save()
                result_data.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        result = Result.objects.get(pk=id_result)
        result.points_user = formula_1(id_result)
        result.save()
        test = Test.objects.get(id=id_test)
        times_solved = test.times_solved + 1
        test.times_solved = times_solved
        test.save()
        return Response(
            {"message": "Added Sucessfully", "status": status.HTTP_201_CREATED},
            status=status.HTTP_201_CREATED,
        )

    @swagger_auto_schema(
        tags=["Result"], operation_description="get all results in database"
    )
    def list(self, request, *args, **kwargs):
        """
        Retrieves all results from the database.

            Args:
                request: The request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response containing a list of serialized results with an HTTP 200 OK status code.
        """
        results = Result.objects.all()
        serializer = ResultsSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["Result"], operation_description="retrieve a result by id"
    )
    def getByResultId(self, request, *args, **kwargs):
        """
        Retrieves a result by its ID.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Keyword arguments, including 'id' for the result ID.

            Returns:
                Response: A JSON response containing the serialized result data with an HTTP 200 OK status code.  Returns a 404 if the result is not found.
        """
        data = get_object_or_404(Result, pk=kwargs["id"])
        serializer = ResultsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["Result"],
        operation_description="retrieve all student's results (IDs) for a test",
    )
    def getByStudentTestId(self, request, *args, **kwargs):
        """
        Retrieves all result IDs for a specific student and test.

            Args:
                request: The HTTP request object.  Not used in the method's logic.
                *args: Variable length argument list (not used).
                **kwargs: Keyword arguments containing 'testId' and 'studentId'.

            Returns:
                Response: A Response object containing a list of result IDs.
        """
        data = list(
            Result.objects.filter(id_test=kwargs["testId"])
            .filter(id_user=kwargs["studentId"])
            .values_list("id", flat=True)
        )
        return Response(data)

    @swagger_auto_schema(
        tags=["Result"], operation_description="retrieve all student's results (IDs)"
    )
    def getByStudentId(self, request, *args, **kwargs):
        """
        Retrieves all result IDs for a given student ID.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list (unused).
                **kwargs: Keyword arguments containing 'studentId'.

            Returns:
                Response: A Response object containing a list of result IDs
                          associated with the provided student ID.
        """
        data = list(
            Result.objects.filter(id_user=kwargs["studentId"]).values_list(
                "id", flat=True
            )
        )
        return Response(data)

    @swagger_auto_schema(
        tags=["Result"], operation_description="retrieve all results (IDs) for a test"
    )
    def getByTestId(self, request, *args, **kwargs):
        """
        Retrieves all result IDs for a given test ID.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list (unused).
                **kwargs: Keyword arguments containing 'testId'.

            Returns:
                Response: A response object containing a list of result IDs.
        """
        data = list(
            Result.objects.filter(id_test=kwargs["testId"]).values_list("id", flat=True)
        )
        return Response(data)

    @swagger_auto_schema(
        tags=["Result"],
        operation_description="retrieve all student's solutions for a test",
    )
    def fullStudentTestId(self, request, *args, **kwargs):
        """
        Retrieves all solutions for a specific student on a given test.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Keyword arguments containing 'testId' and 'studentId'.

            Returns:
                Response: A JSON response containing the serialized results with status code 200 OK.  Returns an empty list if no results are found.
        """
        data = Result.objects.filter(id_test=kwargs["testId"]).filter(
            id_user=kwargs["studentId"]
        )
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["Result"],
        operation_description="retrieve all student's solutions for all tests",
    )
    def fullStudentId(self, request, *args, **kwargs):
        """
        Retrieves all solutions for a given student across all tests.

            Args:
                request: The HTTP request object.
                studentId: The ID of the student whose results are to be retrieved.

            Returns:
                Response: A JSON response containing a list of result objects
                         for the specified student, with a status code of 200 OK.
        """
        data = Result.objects.filter(id_user=kwargs["studentId"])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["Result"], operation_description="retrieve all solutions for a test"
    )
    def fullTestId(self, request, *args, **kwargs):
        """
        Retrieve all solutions for a test.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Keyword arguments, including 'testId'.

            Returns:
                Response: A JSON response containing the serialized results with status code 200 OK.
        """
        data = Result.objects.filter(id_test=kwargs["testId"])
        serializer = ResultsSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TestAPIView(viewsets.ModelViewSet):
    """
    TestAPIView class for handling test creation."""

    serializer_class = TestSerializer

    @swagger_auto_schema(tags=["Test"], operation_description="creates a test")
    def add(self, request, *args, **kwargs):
        """
        Creates a new test with associated questions and answers.

            Args:
                request: The incoming request object containing the test data.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A response indicating success or failure, along with a status code.  On success, returns a message and HTTP 201 Created status. On validation failure, returns error details and HTTP 400 Bad Request status.
        """
        data = request.data
        serializer = TestSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Create Test instance
        test_instance = Test.objects.create(
            author_id=data["author_id"],
            subject_id=data["subject_id"],
            theme_id=data["theme_id"],
            expert_id=data["theme_id"],
            max_points=data["max_points"],
        )

        # Create Question and Answer instances
        for question_data in data["questions"]:
            answers_data = question_data.pop("answers", [])

            question_instance = Question.objects.create(
                id_test=test_instance, **question_data
            )

            for answer_data in answers_data:
                Answer.objects.create(id_question=question_instance, **answer_data)

        return Response(
            {"message": "Added Sucessfully", "status": status.HTTP_201_CREATED},
            status=status.HTTP_201_CREATED,
        )


class TestListView(viewsets.ModelViewSet):
    """
    A view for retrieving a list of tests filtered by subject and theme."""

    serializer_class = TestListSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(
        tags=["Test"],
        operation_description="retrieve a list of tests based on subject and theme IDs",
    )
    def get(self, request, *args, **kwargs):
        """
        Retrieve a list of tests based on subject and theme IDs.

            Args:
                request: The HTTP request object.
                subject_id: The ID of the subject to filter by.
                theme_id: The ID of the theme to filter by.

            Returns:
                Response: A JSON response containing a list of tests matching the provided criteria,
                          serialized using TestListSerializer.
        """
        data = (
            Test.objects.filter(subject_id=kwargs["subject_id"])
            .filter(theme_id=kwargs["theme_id"])
            .values()
        )
        print(data)
        serializer = TestListSerializer(data, many=True)
        return Response(serializer.data)


class TestGetView(viewsets.ModelViewSet):
    """
    A view for retrieving a test without correct answers."""

    serializer_class = TestGetSerializer
    queryset = Test.objects.all()

    @swagger_auto_schema(
        tags=["Test"], operation_description="retrieve a test without correct answers"
    )
    def get(self, request, *args, **kwargs):
        """
        Retrieve a test without correct answers.

            Args:
                request: The request object.
                *args:  Positional arguments passed to the view.
                **kwargs: Keyword arguments passed to the view, including 'pk' for the Test primary key.

            Returns:
                Response: A JSON response containing the serialized test data with a 200 OK status code.
        """
        test = get_object_or_404(Test, pk=kwargs["pk"])
        serializer = TestGetSerializer(test)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllCorrectAnswersView(viewsets.ModelViewSet):
    """
    A view to retrieve all correct answers for questions within a test."""

    serializer_class = CorrectAnswerSerializer
    queryset = Question.objects.all()

    @swagger_auto_schema(
        tags=["Test"],
        operation_description="get correct answers for every question in a test",
    )
    def get(self, request, *args, **kwargs):
        """
        Retrieves the correct answers for each question within a specified test.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments, including 'pk' representing the test ID.

            Returns:
                Response: A JSON response containing a list of dictionaries. Each dictionary
                          represents a question and its corresponding correct answers.  The status code is always 200 OK.
        """
        questions = Question.objects.filter(id_test=kwargs["pk"])

        correct_answers_data = []

        for question in questions:
            answers = (
                Answer.objects.filter(id_question=question.pk)
                .filter(is_correct=True)
                .values()
            )
            data_answers = [answer["answer_text"] for answer in answers]
            correct_answers_data.append(
                {
                    "id_question": question.pk,
                    "correct_answers": data_answers,
                }
            )

        return Response(correct_answers_data, status=status.HTTP_200_OK)


class GetAllCorrectAnswersByQuestionView(viewsets.ModelViewSet):
    """
    Retrieves correct answers for a specified question."""

    serializer_class = AnswerAllSerializer

    @swagger_auto_schema(
        tags=["Test"], operation_description="get correct answers for a one question"
    )
    def get(self, request, *args, **kwargs):
        """
        Retrieves the correct answers for a given question.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Keyword arguments, including 'question_pk' which specifies the ID of the question.

            Returns:
                Response: A JSON response containing a list of correct answers for the specified question,
                          with a status code of 200 OK.  The data is serialized using AnswerAllSerializer.
        """
        answers = (
            Answer.objects.filter(id_question=kwargs["question_pk"])
            .filter(is_correct=True)
            .values()
        )
        serializer = AnswerAllSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
