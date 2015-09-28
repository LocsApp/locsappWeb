from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.core.mail import EmailMessage


class AccountManager(BaseUserManager):
    """
    *When creating user we verify if he entered an email and an username
    We send a mail
    For the super user we just add is_admin = True*
    """

    def create_user(self, email, password=None, **kwargs):
        """
        ::

         def create_user(self, email, password=None, **kwargs):
            if not email:
                raise ValueError('Users must have a valid email address')

            if not kwargs.get('username'):
                raise ValueError('Users must have a valid username')

        """
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
        """
        ::

            account = self.create_user(email, password, **kwargs)
            account.is_admin = True
            account.save()
            return account
        """
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.save()
        return account


# Create your models here.
class Account(AbstractBaseUser):
    """
    *Model account we connect them with email
    Username is required
    Username and email should be unique*::

        email = models.EmailField(unique=True)
        username = models.CharField(max_length=255, unique=True)
        name_enterprise = models.CharField(max_length=255)
        address  = models.TextField(null=True, default=None)
        end_subscription = models.DateTimeField(default=None, blank=True, null=True)
        is_active = models.BooleanField(default=None, blank=True, null=True)
        is_breakage = models.BooleanField(default=True)
        created_at = models.DateTimeField(auto_now_add=True)

    """
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    name_enterprise = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    address = models.TextField(null=True, default=None)
    end_subscription = models.DateTimeField(default=None, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    is_breakage = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)



    objects = AccountManager()
    object = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    #def objects(self):
    #    return "toto"