from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import LoginSerializer, RegistrationSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .decorators import (
    student_access_only,
    teacher_access_only,
    admin_access_only
)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    

class RegistrationAPIView(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def signup(self, request, *args, **kwargs):
        user = request.data
        serializer = RegistrationSerializer(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)
    

class UserAPIView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User

    def get_user(self, request, *args, **kwargs):
        data = list(User.objects.filter(id=kwargs['pk']).values('id', 'username', 'email', 'role'))
        return Response(data, status=status.HTTP_200_OK)
    
    @admin_access_only()
    def admin(self, request, *args, **kwargs):
        return Response(True)

    @teacher_access_only()
    def teacher(self, request, *args, **kwargs):
        return Response(True)
    
    @student_access_only()
    def student(self, request, *args, **kwargs):
        return Response(True)