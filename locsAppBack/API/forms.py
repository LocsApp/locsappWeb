from django import forms
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext_lazy as _

from allauth.account.utils import (user_username, user_email,
                                   user_field)
from .adapter import get_adapter
from django.conf import settings


class SignupForm(forms.Form):
    email = ArrayField(forms.CharField(max_length=30, label='Voornaam'))

    def signup(self, request, user):
        user.email = (self.cleaned_data['email'])
        user.save()

