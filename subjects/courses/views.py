from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import *
from .serializers import *


class SubjectView(viewsets.ModelViewSet):
    """
    Provides a view for managing Subject data."""

    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def list(self, request, *args, **kwargs):
        """
        Returns a list of all subjects.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response containing a list of subject data.  Each element in the list represents a subject and contains its values as key-value pairs.
        """
        data = list(Subject.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a subject by its primary key.

            Args:
                request: The HTTP request object.  Not used in the current implementation.
                *args: Positional arguments (unused).
                **kwargs: Keyword arguments, specifically expecting 'pk' for the primary key.

            Returns:
                Response: A Response object containing a list of dictionaries representing the subject data.
                          The list will contain one dictionary if a subject with the given pk is found,
                          and an empty list otherwise.
        """
        data = list(Subject.objects.filter(id=kwargs["pk"]).values())
        return Response(data)

    def add(self, request, *args, **kwargs):
        """
        Adds a new subject based on the provided request data.

            Args:
                request: The HTTP request object containing the subject data.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response indicating success or failure, along with an appropriate status code.  Returns a 201 Created status on success and a 400 Bad Request if the data is invalid.
        """
        subject_serializer_data = SubjectSerializer(data=request.data)
        if subject_serializer_data.is_valid():
            subject_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response(
                {"message": "Added Sucessfully", "status": status_code}, status_code
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {"message": "Please fill the datails", "status": status_code},
                status_code,
            )

    def delete(self, request, *args, **kwargs):
        """
        Deletes a Subject object based on its primary key.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments, expected to contain 'pk' for the subject ID.

            Returns:
                Response: A JSON response indicating success or failure with an appropriate status code.
                          Returns a 201 Created status on successful deletion and a 400 Bad Request if the data is not found.
        """
        subject_data = Subject.objects.filter(id=kwargs["pk"])
        if subject_data:
            subject_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response(
                {"message": "Deleted Sucessfully", "status": status_code}, status_code
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {"message": "Data not found", "status": status_code}, status_code
            )


class ThemeView(viewsets.ModelViewSet):
    """
    Provides a view for managing themes."""

    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer

    def list(self, request, *args, **kwargs):
        """
        Returns a list of all themes.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response containing a list of theme data.  Each element in the list
                          represents a theme and contains its values as key-value pairs.
        """
        data = list(Theme.objects.all().values())
        return Response(data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a Theme object by its primary key.

            Args:
                request: The HTTP request object.  Not used in the current implementation.
                *args: Positional arguments (unused).
                **kwargs: Keyword arguments, specifically expecting 'pk' for the theme ID.

            Returns:
                Response: A Django REST Framework Response containing a list with a dictionary
                          representing the Theme data if found; otherwise an empty list.
        """
        data = list(Theme.objects.filter(id=kwargs["pk"]).values())
        return Response(data)

    def add(self, request, *args, **kwargs):
        """
        Adds a new theme based on the provided request data.

            Args:
                request: The HTTP request object containing the theme data.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response indicating success or failure, along with an appropriate status code.  Returns a 201 Created status on success and a 400 Bad Request if the data is invalid.
        """
        themes_serializer_data = ThemeSerializer(data=request.data)
        if themes_serializer_data.is_valid():
            themes_serializer_data.save()
            status_code = status.HTTP_201_CREATED
            return Response(
                {"message": "Added Sucessfully", "status": status_code}, status_code
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {"message": "please fill the datails", "status": status_code},
                status_code,
            )

    def delete(self, request, *args, **kwargs):
        """
        Deletes a Theme object based on its primary key.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments, expected to contain 'pk' for the theme ID.

            Returns:
                Response: A JSON response indicating success or failure with an appropriate status code.
                          Returns a 201 Created status on successful deletion and a 400 Bad Request if the data is not found.
        """
        themes_data = Theme.objects.filter(id=kwargs["pk"])
        if themes_data:
            themes_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response(
                {"message": "Deleted Sucessfully", "status": status_code}, status_code
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {"message": "Data not found", "status": status_code}, status_code
            )

    def getBySubjectId(self, request, *args, **kwargs):
        """
        Retrieves themes associated with a given subject ID.

            Args:
                request: The HTTP request object.  Not used in the method's logic.
                *args: Variable length argument list (not used).
                **kwargs: Keyword arguments, specifically expects 'subject_id'.

            Returns:
                Response: A Django REST Framework Response object containing a list of
                    dictionaries representing the themes found for the given subject ID.
                    Each dictionary corresponds to a theme's data as returned by values().
        """
        data = list(Theme.objects.filter(id_subject=kwargs["subject_id"]).values())
        return Response(data)


class CourseView(viewsets.ModelViewSet):
    """
    CourseView class for managing course-related operations."""

    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def add(self, request, *args, **kwargs):
        """
        Adds a new course.

            Handles both validated data from a serializer and direct input for basic course creation.

            Args:
                request: The HTTP request object containing the course data.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response indicating success or failure, along with an appropriate status code.  On success, returns a 201 Created status and a success message. On validation errors or missing data, returns a 400 Bad Request with an error message.
        """
        data = request.data
        id_expert = data.get("id_expert")
        name_course = data.get("name_course")
        id_subject = data.get("id_subject")
        description = data.get("description")

        course_serializer_data = CourseSerializer(data=data)
        if course_serializer_data.is_valid(raise_exception=True):
            course_serializer_data.save()
            return Response(
                {"message": "Added Sucessfully", "status": status.HTTP_201_CREATED},
                status=status.HTTP_201_CREATED,
            )
        else:
            if not name_course or not id_subject:
                return Response(
                    {
                        "error": "Both name_course and id_subject are required.",
                        "status": status.HTTP_400_BAD_REQUEST,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            try:
                subject = Subject.objects.get(id=id_subject)
            except Subject.DoesNotExist:
                return Response(
                    {
                        "error": f"Subject with id {id_subject} does not exist.",
                        "status": status.HTTP_400_BAD_REQUEST,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            course = Course(name_course=name_course, id_subject=subject)
            course.save()
            return Response(
                {"message": "Added Sucessfully", "status": status.HTTP_201_CREATED},
                status=status.HTTP_201_CREATED,
            )

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a course by its primary key.

            Args:
                request: The HTTP request object.  Not used in the current implementation.
                *args: Positional arguments (unused).
                **kwargs: Keyword arguments, specifically expecting 'pk' for the course ID.

            Returns:
                Response: A Django REST Framework Response containing a list with a dictionary
                          representing the course data if found; otherwise an empty list.
        """
        data = list(Course.objects.filter(id=kwargs["pk"]).values())
        return Response(data)

    def list(self, request, *args, **kwargs):
        """
        Returns a list of all courses.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments.

            Returns:
                Response: A JSON response containing a list of course data.  Each item in the list
                          represents a course and contains its values as key-value pairs.
        """
        data = list(Course.objects.all().values())
        return Response(data)

    def delete(self, request, *args, **kwargs):
        """
        Deletes a course based on its primary key.

            Args:
                request: The HTTP request object.
                *args: Variable length argument list.
                **kwargs: Arbitrary keyword arguments, expected to contain 'pk' for the course ID.

            Returns:
                Response: A JSON response indicating success or failure with an appropriate status code.
                          Returns a 201 Created status on successful deletion and a 400 Bad Request if the course is not found.
        """
        course_data = Course.objects.filter(id=kwargs["pk"])
        if course_data:
            course_data.delete()
            status_code = status.HTTP_201_CREATED
            return Response(
                {"message": "Deleted Sucessfully", "status": status_code}, status_code
            )
        else:
            status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {"message": "Data not found", "status": status_code}, status_code
            )

    def getBySubjectId(self, request, *args, **kwargs):
        """
        Retrieves courses based on a subject ID.

            Args:
                request: The HTTP request object.  Not used in the method's logic but is required for Django view methods.
                *args: Variable length argument list (not used).
                **kwargs: Keyword arguments, specifically expects 'subject_id'.

            Returns:
                Response: A JSON response containing a list of course data
                          matching the provided subject ID.  Each item in the list
                          represents a course and contains its values as a dictionary.
        """
        data = list(Course.objects.filter(id_subject=kwargs["subject_id"]).values())
        return Response(data)

    def getByIdExpert(self, request, *args, **kwargs):
        """
        Retrieves courses associated with a specific expert ID.

            Args:
                request: The HTTP request object (unused).
                *args:  Positional arguments (unused).
                **kwargs: Keyword arguments containing 'expert_id'.

            Returns:
                Response: A Django Response object containing a list of dictionaries,
                          where each dictionary represents a course associated with the given expert ID.
        """
        data = list(Course.objects.filter(id_expert=kwargs["expert_id"]).values())
        return Response(data)

    def getExpertInfo(self, request, *args, **kwargs):
        """
        Retrieves course information for a specific expert and subject.

            Args:
                request: The HTTP request object (unused).
                *args:  Positional arguments (unused).
                **kwargs: Keyword arguments containing 'expert_id' and 'subject_id'.

            Returns:
                Response: A Response object containing a list of dictionaries,
                          where each dictionary represents course data for the specified expert and subject.
        """
        data = list(
            Course.objects.filter(id_expert=kwargs["expert_id"])
            .filter(id_subject=kwargs["subject_id"])
            .values()
        )
        return Response(data)
