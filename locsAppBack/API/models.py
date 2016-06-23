from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from allauth.account.models import EmailAddress
from allauth.account.signals import email_confirmed, email_confirmation_sent
from django.dispatch import receiver
# User model
from django.contrib.auth import get_user_model


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

    secondary_emails = ArrayField(ArrayField(models.TextField(null=True, default=None),
                                             null=True, size=2), null=True, size=5)

    first_name = models.CharField(max_length=30, default=None, null=True)
    last_name = models.CharField(max_length=30, default=None, null=True)
    birthdate = models.CharField(max_length=30, null=True)
    gender = models.CharField(max_length=30, null=True)

    phone = models.CharField(max_length=10, null=True)
    living_address = ArrayField(ArrayField(models.TextField(null=True, default=None), null=True,
                                           size=2), null=True, size=5)
    billing_address = ArrayField(ArrayField(models.TextField(null=True, default=None), null=True,
                                            size=2), null=True, size=5)
    logo_url = models.CharField(max_length=255, null=True)

    registered_date = models.DateTimeField(default=timezone.now)
    last_activity_date = models.DateTimeField(null=True)

    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=10, default="user")

    created_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    id_facebook = models.CharField(default="", null=True, max_length=255)

    tenant_score = models.IntegerField(default=-1)
    renter_score = models.IntegerField(default=-1)

    article_favorite = ArrayField(ArrayField(models.CharField(max_length=30), blank=True), null=True)

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

    def add_email_address(self, request, new_email, reconfirm):
        try:
            email = EmailAddress.objects.get(email=new_email)
        except:
            email = EmailAddress.objects.add_email(
                request, self, new_email, confirm=True)
            if self.secondary_emails is None:
                self.secondary_emails = [[email.email, "false"]]
            else:
                self.secondary_emails.append([email.email, "false"])
            self.save(update_fields=['secondary_emails'])
            return {"message": "Confirmation email sent!"}
        if (email.user_id != self.pk):
            return {"Error": "This email is already used by another user."}
        EmailAddress.objects.get(email=new_email).delete()
        email = EmailAddress.objects.add_email(
            request, self, new_email, confirm=True)
        return {"message": "Reconfirmation email sent!"}

    def delete_email_address(self, request, email_data):
        try:
            email = EmailAddress.objects.get(email=email_data)
        except:
            return {"Error": "This email doesn't exist."}
        if email.user_id != self.pk:
            return {"Error": "This email is already used by another user."}
        for i, email_obj in enumerate(self.secondary_emails):
            if email_obj[0] == email_data:
                self.secondary_emails.pop(i)
                EmailAddress.objects.get(email=email_data).delete()
                self.save(update_fields=['secondary_emails'])
                return {"message": "Email succesfully deleted"}
        return {"Error": "The email wasn't found in the secondary emails."}


@receiver(email_confirmed)
def update_user_email(sender, request, email_address, **kwargs):
    User = get_user_model()
    user = User.object.get(pk=email_address.user_id)
    if user.secondary_emails is None:
        return
    for email_obj in user.secondary_emails:
        if email_address.email == email_obj[0]:
            email_obj[1] = "true"
            user.save()
            break


@receiver(email_confirmation_sent)
def email_confimation_sent(confirmation, **kwargs):
    print(confirmation)
