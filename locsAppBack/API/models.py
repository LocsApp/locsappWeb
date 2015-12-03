from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.core.mail import EmailMessage
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from rest_framework import serializers


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )
        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.save()
        return account


class Account(AbstractBaseUser):
    email = models.EmailField(unique=True, blank=False)
    username = models.CharField(max_length=20, unique=True, blank=False)

    secondary_emails = ArrayField(models.EmailField(unique=False), null=True)

    first_name = models.CharField(max_length=30, default=None, null=True)
    last_name = models.CharField(max_length=30, default=None, null=True)
    birthdate = models.CharField(max_length=30, null=True)

    phone = models.CharField(max_length=10, null=True)
    living_address = ArrayField(ArrayField(models.TextField(null=True, default=None), null=True, size=2), null=True,
                                size=5)
    billing_address = ArrayField(ArrayField(models.TextField(null=True, default=None), null=True, size=2), null=True,
                                 size=5)
    logo_url = models.CharField(max_length=255, null=True)

    registered_date = models.DateTimeField(default=timezone.now)
    last_activity_date = models.DateTimeField(null=True)

    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=10, default="user")

    created_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)

    objects = AccountManager()
    object = AccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'birthdate', 'phone', 'living_address']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return self.first_name

    def get_short_name(self):
        return self.last_name

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin