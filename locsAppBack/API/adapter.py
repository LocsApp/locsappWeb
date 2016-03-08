from __future__ import absolute_import
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from django.core.exceptions import ValidationError
from allauth.utils import (import_attribute,
                           email_address_exists,
                           valid_email_or_none)
from allauth.account.utils import user_email, user_username, user_field
from allauth.account.models import EmailAddress
from allauth.account.adapter import get_adapter as get_account_adapter
from allauth.account import app_settings as account_settings
from allauth.account.app_settings import EmailVerificationMethod
from rest_framework.response import Response
import json
from django.http import HttpResponse
from allauth.socialaccount import app_settings
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from allauth.account.signals import user_signed_up, user_logged_in
from django.dispatch import receiver
from pprint import pprint
from django.http import JsonResponse


class DefaultAccountAdapterCustom(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = settings.URL_FRONT + \
                                  'verify-email/' + context['key']
        msg = self.render_mail(template_prefix, email, context)
        msg.send()


def get_adapter():
    return import_attribute(app_settings.ADAPTER)()
