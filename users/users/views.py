from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Profile
from .serializers import ProfileSerializer, UserSerializer, ProfileDetailSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@swagger_auto_schema(tags=["Profile"])
@api_view(['POST'])
def register_user(request):
    user_serializer = UserSerializer(data=request.data)
    profile_serializer = ProfileSerializer(data=request.data)

    if user_serializer.is_valid() and profile_serializer.is_valid():
        user = user_serializer.save()
        profile_data = {'user': user.id, 'role': request.data['role']}
        profile_serializer = ProfileSerializer(data=profile_data)

        if profile_serializer.is_valid():
            profile_serializer.save()
            return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)

    return Response({'status': 'Error', 'errors': user_serializer.errors + profile_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(tags=["Profile"])
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileDetailSerializer(profile)
    return Response(serializer.data)