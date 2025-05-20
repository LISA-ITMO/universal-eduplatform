from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import (
    LoginSerializer,
    RegistrationSerializer,
    UserSerializer,
    LogoutSerializer,
    SignInSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .decorators import student_access_only, teacher_access_only, admin_access_only
import jwt
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema


def get_tokens_for_user(user):
    """
    Retrieves refresh and access tokens for a given user.

        Args:
            user: The user object for whom to retrieve the tokens.

        Returns:
            dict: A dictionary containing the refresh and access tokens as strings.
                  The dictionary has keys 'refresh' and 'access'.
    """
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class LoginView(viewsets.ModelViewSet):
    """
    A view for handling user login and providing authentication tokens."""

    serializer_class = LoginSerializer

    @swagger_auto_schema(
        request_body=LoginSerializer, responses={200: SignInSerializer}
    )
    def post(self, request, format=None):
        """
        Handles user login and returns authentication tokens.

            Args:
                request: The HTTP request object containing username and password.
                format:  The expected media type of the request body (optional).

            Returns:
                Response: A Response object containing user data and sets cookies for access and refresh tokens on successful login, or an error message if authentication fails.
        """
        data = request.data
        response = Response()
        username = data.get("username", None)
        password = data.get("password", None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=data["access"],
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )
                response.set_cookie(
                    key="refresh_token",
                    value=data["refresh"],
                    expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )
                response.data = list(
                    User.objects.filter(username=request.data["username"]).values(
                        "id", "username", "email", "role", "is_active"
                    )
                )
                return response
            else:
                return Response(
                    {"No active": "This account is not active"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"Invalid": "Invalid username or password"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RegistrationAPIView(generics.CreateAPIView):
    """
    Provides an API endpoint for user registration."""

    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer


class UserAPIView(viewsets.ModelViewSet):
    """
    API view for managing user access and roles."""

    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User

    @admin_access_only()
    def admin(self, request, *args, **kwargs):
        """
        Handles administrative requests.

          This method is decorated with `@admin_access_only()`, ensuring only
          users with administrator privileges can access it. It currently returns
          a simple success response.

          Args:
            request: The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

          Returns:
            Response: A JSON Response indicating success (True).
        """
        return Response(True)

    @teacher_access_only()
    def teacher(self, request, *args, **kwargs):
        """
        Returns True for the teacher view.

          Args:
            request: The HTTP request object.
            *args: Positional arguments passed to the view.
            **kwargs: Keyword arguments passed to the view.

          Returns:
            Response: A response object containing a boolean value of True.
        """
        return Response(True)

    @student_access_only()
    def student(self, request, *args, **kwargs):
        """
        Returns True if the current user is a student.

          This method checks if the requesting user has student access and returns
          a success indicator.

          Args:
            request: The HTTP request object.
            *args: Variable length argument list (unused).
            **kwargs: Arbitrary keyword arguments (unused).

          Returns:
            Response: A Response object containing True, indicating successful student access check.
        """
        return Response(True)


class LogoutAPIView(generics.GenericAPIView):
    """
    Logout API view."""

    serializer_class = LogoutSerializer

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Creates a new object from the request data.

            Args:
                request: The incoming request object containing the data for the new object.

            Returns:
                Response: A response with status code 204 (No Content) upon successful creation.
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class TokenDecode(viewsets.ViewSet):
    """
    Decodes a JWT token and returns the decoded payload."""

    def decode(self, request, *args, **kwargs):
        """
        Decodes a JWT token and returns the decoded payload.

            Args:
                request: The HTTP request object (unused).
                *args: Variable length argument list (unused).
                **kwargs: Keyword arguments, including 'token' which is the JWT to decode.

            Returns:
                Response: A Django REST Framework Response object.  If successful,
                    the response contains the decoded token payload with a 200 OK status code.
                    If unsuccessful (expired or invalid token), it returns an error message
                    with a 401 Unauthorized status code.
        """
        try:
            token = jwt.decode(
                kwargs["token"], key=settings.SECRET_KEY, algorithms=["HS256"]
            )
            return Response(token, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )
