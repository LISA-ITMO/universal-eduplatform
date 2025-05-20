from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import LoginSerializer, RegistrationSerializer, UserSerializer, LogoutSerializer, SignInSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .decorators import (
    student_access_only,
    teacher_access_only,
    admin_access_only
)
import jwt
from django.conf import settings 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(viewsets.ModelViewSet):
    serializer_class = LoginSerializer

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: SignInSerializer})
    def post(self, request, format=None):
        data = request.data
        response = Response()
        username = data.get('username', None)
        password = data.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=data["access"],
                    expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.set_cookie(
                    key='refresh_token',
                    value=data["refresh"],
                    expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.data = list(User.objects.filter(username=request.data['username']).values('id', 'username', 'email', 'role', 'is_active'))
                return response
            else:
                return Response({"No active": "This account is not active"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid": "Invalid username or password"}, status=status.HTTP_404_NOT_FOUND)
    
class RegistrationAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

class UserAPIView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User
    
    @admin_access_only()
    def admin(self, request, *args, **kwargs):
        return Response(True)

    @teacher_access_only()
    def teacher(self, request, *args, **kwargs):
        return Response(True)
    
    @student_access_only()
    def student(self, request, *args, **kwargs):
        return Response(True)

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (IsAuthenticated,)

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TokenDecode(viewsets.ViewSet):
    def decode(self, request, *args, **kwargs):
        try:
            token = jwt.decode(kwargs['token'],
                                key=settings.SECRET_KEY,
                                algorithms=["HS256"])
            return Response(token, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

# Новый класс для возврата данных пользователя
class UserMeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user  # Пользователь уже аутентифицирован через JWT
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)