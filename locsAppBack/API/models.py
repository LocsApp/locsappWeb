from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.core.mail import EmailMessage
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

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
    email = ArrayField(models.EmailField(unique=True))
    username = models.CharField(max_length=20,unique=True)

    first_name = models.CharField(max_length=30, default=None, null=True)
    last_name = models.CharField(max_length=30, default=None, null=True)   
    birthdate = models.CharField(max_length=30, null=True)
    phone = models.CharField(max_length=10, null=True)
    living_address = ArrayField(models.TextField(null=True, default=None))
    billing_address = ArrayField(models.TextField(null=True, default=None))
    logo_url = models.CharField(max_length=255, null=True)

    registered_date = models.DateTimeField(default=timezone.now)
    last_activity_date = models.DateTimeField(null=True)

    is_active = models.CharField(max_length=10, default=True)
    role = models.CharField(max_length=10, default="user")

    created_at = models.DateTimeField(auto_now_add=True)



    objects = AccountManager()
    object = AccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'birthdate', 'phone', 'living_address']

    def __unicode__(self):
        return self.email