from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin, Group)

from django.db import models

class RoleField(models.CharField):
    ROLE_CHOICES = [
        ('student', 'student'),
        ('teacher', 'teacher'),
        ('admin', 'admin'),
    ]

    def __init__(self, *args, **kwargs):
        kwargs['choices'] = self.ROLE_CHOICES
        kwargs['max_length'] = 7
        kwargs['blank'] = False
        kwargs['null'] = False
        super().__init__(*args, **kwargs)


class UserManager(BaseUserManager):
    def create_user(self, username, email, role, password=None):
        """ Создает и возвращает пользователя с имэйлом, паролем и именем. """
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=self.normalize_email(email), role=role)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password, **extra_fields):
        """ Создает и возввращет пользователя с привилегиями суперадмина. """
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('role') != 'admin':
            raise ValueError('Superuser must have role of Admin')
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    role = RoleField(default='student')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username
