from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

from django.db import models


class RoleField(models.CharField):
    """
    A field for representing a user's role with predefined choices."""

    ROLE_CHOICES = [
        ("student", "student"),
        ("teacher", "teacher"),
        ("admin", "admin"),
    ]

    def __init__(self, *args, **kwargs):
        """
        Initializes the RoleField.

            Sets default values for choices, max_length, blank, and null
            before calling the superclass initializer.

            Args:
                *args: Positional arguments passed to the superclass constructor.
                **kwargs: Keyword arguments passed to the superclass constructor.

            Returns:
                None
        """
        kwargs["choices"] = self.ROLE_CHOICES
        kwargs["max_length"] = 7
        kwargs["blank"] = False
        kwargs["null"] = False
        super().__init__(*args, **kwargs)


class UserManager(BaseUserManager):
    """
    Manages user creation, including regular users and superusers."""

    def create_user(self, username, email, password, **extra_fields):
        """Создает и возвращает пользователя с имэйлом, паролем и именем."""
        if username is None:
            raise TypeError("Users must have a username.")

        if email is None:
            raise TypeError("Users must have an email address.")

        user = self.model(
            username=username, email=self.normalize_email(email), **extra_fields
        )
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """Создает и возввращет пользователя с привилегиями суперадмина."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Represents a user in the system.

        Attributes:
            username: The user's unique username.
            email: The user's email address.
            is_active:  Indicates whether the user account is active.
            is_staff: Indicates if the user has staff access.
            is_superuser: Indicates if the user has superuser privileges.
            created_at: Timestamp of when the user was created.
            updated_at: Timestamp of when the user was last updated.
            role: The role assigned to the user.

        Methods:
            __str__: Returns a string representation of the object.
    """

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    role = RoleField(default="student")

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    def __str__(self):
        """
        Returns a string representation of the object.

          Args:
            None

          Returns:
            str: A human-readable string representing the object.
        """
        return self.email
