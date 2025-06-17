from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.utils.text import gettext_lazy as _


class LoginSerializer(TokenObtainPairSerializer):
    """
    Serializes user login and generates a JWT token with custom claims."""

    def get_token(self, user):
        """
        Retrieves a token for the given user and adds custom claims.

          This method retrieves a base token from the superclass's `get_token`
          method and then extends it with additional information about the user,
          specifically their username and role.

          Args:
            user: The user object for whom to generate the token.

          Returns:
            dict: A dictionary representing the JWT token, including custom claims
                  for 'username' and 'role'.
        """
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        token["role"] = user.role

        return token


class SignInSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_active"]


class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializes user registration data and creates a new user."""

    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "password"]

    @classmethod
    def create(self, validated_data):
        """
        Creates a new user.

            Args:
                validated_data: A dictionary containing the data for the new user,
                    as validated by a serializer or similar process.  This should
                    include fields like username, password, and email.

            Returns:
                User: The newly created User object.
        """
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    """No valid docstring found."""

    class Meta:
        model = User
        fields = ["id", "email", "username", "role"]


class LogoutSerializer(serializers.Serializer):
    """
    Logout Serializer.

    This serializer handles the logout process by validating and blacklisting refresh tokens.
    """

    refresh = serializers.CharField()

    default_error_message = {"bad_token": ("Token is expired or invalid")}

    def validate(self, attrs):
        """
        Validates the input attributes and stores the refresh token.

          Args:
            attrs: A dictionary of attributes to validate.  Must contain 'refresh'.

          Returns:
            dict: The original attribute dictionary if validation is successful.
        """
        self.token = attrs["refresh"]
        return attrs

    def save(self, **kwargs):
        """
        Saves the current authentication token by blacklisting any existing refresh token.

            Args:
                **kwargs:  Additional keyword arguments (currently unused).

            Returns:
                None: This method does not return a value; it either succeeds in saving
                      the token or fails and calls self.fail().
        """

        try:
            RefreshToken(self.token).blacklist()

        except TokenError:
            self.fail("bad_token")
