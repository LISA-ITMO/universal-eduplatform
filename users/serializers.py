from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'description', 'role')


# Allows to edit both User's and Profile's view at the same time
class ProfileUserSerializer(serializers.Serializer):
    user = CustomUserSerializer()
    profile = ProfileSerializer()

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        profile_data = validated_data.pop('profile', {})

        user_serializer = CustomUserSerializer(instance=instance.user, data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        profile_serializer = ProfileSerializer(instance=instance, data=profile_data)
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()

        return instance
