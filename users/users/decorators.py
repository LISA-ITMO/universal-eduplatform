import jwt
from django.conf import settings
from rest_framework.response import Response
from functools import wraps
from rest_framework import status


def student_function(token):
    """
    Checks if a given token belongs to a student.

        Decodes the provided JWT token and verifies if the 'role' claim is set to 'student'.
        Returns True if the token is valid and represents a student, False otherwise.
        Handles decoding errors by returning an error response.

        Args:
            token: The JWT token string to validate.

        Returns:
            Response: A Response object containing either True (if the user is a student)
                      or False (if not a student or if there's an issue with the token).
                      In case of decoding errors, returns a Response with 'Status': 'Failed' and an error message.
    """
    try:
        token = jwt.decode(token, key=settings.SECRET_KEY, algorithms=["HS256"])
        if token["role"] == "student":
            return Response(True)
    except Exception as e:
        return Response(
            {
                "Status": "Failed",
                "Message": str(e),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response(False)


def student_access_only():
    """
    Only allow access to students.

        This decorator checks if the user has a valid student token before
        allowing access to the view function.  If the token is invalid, it returns
        a "You are not a student" response. Otherwise, it calls the original view
        function with the provided request and arguments.

        Args:
            None

        Returns:
            decorator: A decorator that wraps the view function to enforce
                student-only access.
    """

    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not student_function(kwargs["token"]):
                return Response("You are not a student")
            return student_function(kwargs["token"])

        return _wrapped_view

    return decorator


def teacher_function(token):
    """
    Verifies if a given token belongs to a teacher.

        Decodes the provided JWT token and checks if the 'role' claim is set to 'teacher'.
        Returns True if it is, False otherwise.  Handles decoding errors gracefully.

        Args:
            token: The JWT token string to verify.

        Returns:
            Response: A Response object containing a boolean indicating teacher status (True/False) or an error message in case of failure.
    """
    try:
        token = jwt.decode(token, key=settings.SECRET_KEY, algorithms=["HS256"])
        if token["role"] == "teacher":
            return Response(True)
    except Exception as e:
        return Response(
            {
                "Status": "Failed",
                "Message": str(e),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response(False)


def teacher_access_only():
    """
    Checks if the user has teacher access based on a token.

        This decorator restricts access to a view function only to users with valid
        teacher tokens. It verifies the token using the `teacher_function` and returns
        an error message if the token is invalid.

        Args:
            None

        Returns:
            decorator: A decorator that wraps the view function and enforces teacher access control.
    """

    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not teacher_function(kwargs["token"]):
                return Response("You are not a teacher")
            return teacher_function(kwargs["token"])

        return _wrapped_view

    return decorator


def admin_function(token):
    """
    Checks if a user has admin privileges based on a JWT token.

        Args:
            token: The JWT token to decode and validate.

        Returns:
            Response: True if the token is valid and the user has the 'admin' role,
                      False otherwise.  If an error occurs during decoding or validation,
                      returns a JSON response with a "Failed" status and an error message.
    """
    try:
        token = jwt.decode(token, key=settings.SECRET_KEY, algorithms=["HS256"])
        if token["role"] == "admin":
            return Response(True)
    except Exception as e:
        return Response(
            {
                "Status": "Failed",
                "Message": str(e),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    return Response(False)


def admin_access_only():
    """
    Only allow access to admins."""

    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not admin_function(kwargs["token"]):
                return Response("You are not an admin")
            return admin_function(kwargs["token"])

        return _wrapped_view

    return decorator
