from rest_framework import generics
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer, ProfileUserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView


class ProfileAdminStatus(APIView):
    @swagger_auto_schema(tags=["Profile"])
    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        return Response({"is_admin": profile.user.is_superuser})


# Allows to edit both User's and Profile's view at the same time, thanks to ProfileUserSerializer
class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileUserSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Profile"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Profile"])
    def post(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Profile"])
    def put(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Profile"])
    def delete(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Profile"])
    def patch(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ProfileMoneyUpdateAPIView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def put(self, request, *args, **kwargs):
        raise MethodNotAllowed('PUT')

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.money = request.data.get('money', instance.money)
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
