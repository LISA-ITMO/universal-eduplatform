from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import LoginSerializer, RegistrationSerializer, UserSerializer, LogoutSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .decorators import (
    student_access_only,
    teacher_access_only,
    admin_access_only
)

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, * args, ** kwargs):
        response = super().post(request, * args, ** kwargs) # Get tokens as usual

        # Set access token as HttpOnly cookie
        response.set_cookie('access_token', response.data['access'], httponly = True)

        # Set refresh token as HttpOnly cookie
        response.set_cookie('refresh_token', response.data['refresh'], httponly = True)
        data = list(User.objects.filter(username=request.data['username']).values('id', 'username', 'email', 'role', 'is_active'))

        return Response(data, status=status.HTTP_200_OK)
    
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
    
