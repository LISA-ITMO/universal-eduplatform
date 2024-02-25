import jwt
from django.conf import settings 
from rest_framework.response import Response
from functools import wraps
from rest_framework import status

def student_function(token):
    try:
        token = jwt.decode(token,
                            key=settings.SECRET_KEY,
                            algorithms=["HS256"])
        if token['role'] == 'student':
            return Response(True)
    except Exception as e:
        return Response({
            'Status': 'Failed',
            'Message': str(e),
        }, status=status.HTTP_400_BAD_REQUEST)
    return Response(False)


def student_access_only():
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not student_function(kwargs['token']):
                return Response("You are not a student")
            return student_function(kwargs['token'])
        return _wrapped_view
    return decorator

def teacher_function(token):
    try:
        token = jwt.decode(token,
                            key=settings.SECRET_KEY,
                            algorithms=["HS256"])
        if token['role'] == 'teacher':
            return Response(True)
    except Exception as e:
        return Response({
            'Status': 'Failed',
            'Message': str(e),
        }, status=status.HTTP_400_BAD_REQUEST)
    return Response(False)


def teacher_access_only():
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not teacher_function(kwargs['token']):
                return Response("You are not a teacher")
            return teacher_function(kwargs['token'])
        return _wrapped_view
    return decorator

def admin_function(token):
    try:
        token = jwt.decode(token,
                            key=settings.SECRET_KEY,
                            algorithms=["HS256"])
        if token['role'] == 'admin':
            return Response(True)
    except Exception as e:
        return Response({
            'Status': 'Failed',
            'Message': str(e),
        }, status=status.HTTP_400_BAD_REQUEST)
    return Response(False)


def admin_access_only():
    def decorator(view):
        @wraps(view)
        def _wrapped_view(request, *args, **kwargs):
            if not admin_function(kwargs['token']):
                return Response("You are not an admin")
            return admin_function(kwargs['token'])
        return _wrapped_view
    return decorator