__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account
from allauth.account.models import EmailAddress


class AccountRegisterTestCase(APITestCase):
    def setUp(self):
        self.login_url = 'http://127.0.0.1:8000/api/v1/rest-auth/login/'
        self.register_url = 'http://127.0.0.1:8000/api/v1/rest-auth/registration/'

    def create_user(self):
        data = {"username": "test", "email": "toto@hotmail.fr", "password1": "toto42", "password2": "toto42"}
        self.client.post(self.register_url, data, format='json')

    def test_account_not_valid(self):
        """
        Ensures we can create a new invalid account object.
        """
        self.create_user()
        data = {"username": "test", "password": "toto42"}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(response.data, {'non_field_errors': ['E-mail is not verified.']})
        self.assertEqual(Account.objects.get().username, 'test')

    def test_account_valid(self):
        """
        Ensures we can create a new valid account object.
        """
        self.create_user()
        user = Account.object.get(username="test")
        email_address = EmailAddress.objects.get(user=user, email="toto@hotmail.fr")
        email_address.primary = True
        email_address.verified = True
        email_address.save()
        data = {"username": "test", "password": "toto42"}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().username, 'test')
