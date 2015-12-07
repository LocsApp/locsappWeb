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


class SocialNetworkSignupForm(forms.Form):

    def __init__(self, *args, **kwargs):
        self.sociallogin = kwargs.pop('sociallogin')
        user = self.sociallogin.user
        # TODO: Should become more generic, not listing
        # a few fixed properties.
        initial = {'email': user_email(user) or '',
                   'username': user_username(user) or '',
                   'first_name': user_field(user, 'first_name') or '',
                   'last_name': user_field(user, 'last_name') or ''}
        kwargs.update({
            'initial': initial,
            'email_required': kwargs.get('email_required',
                                         settings.EMAIL_REQUIRED)})
        #super(SignupForm, self).__init__(*args, **kwargs)

    def save(self, request):
        adapter = get_adapter()
        user = adapter.save_user(request, self.sociallogin, form=self)
        self.custom_signup(request, user)
        return user

    def raise_duplicate_email_error(self):
        raise forms.ValidationError(
            _("An account already exists with this e-mail address."
              " Please sign in to that account first, then connect"
              " your %s account.")
            % self.sociallogin.account.get_provider().name)