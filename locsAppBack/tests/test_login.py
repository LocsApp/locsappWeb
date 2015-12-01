__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account


class AccountRegisterTestCase(APITestCase):
    def setUp(self):
        self.login_url = 'http://127.0.0.1:8000/api/v1/rest-auth/login/'
        self.register_url = 'http://127.0.0.1:8000/api/v1/rest-auth/registration/'

    def create_user(self):
        data = {"username": "test", "email": "toto@hotmail.fr", "password1": "toto42", "password2": "toto42"}
        self.client.post(self.register_url, data, format='json')

    def test_account_not_valid(self):
        """
        Ensures we can create a new account object.
        """
        self.create_user()
        data = {"username": "test", "password": "toto42"}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(response.data, {'non_field_errors': ['E-mail is not verified.']})
        self.assertEqual(Account.objects.get().username, 'test')
        #sself.assertEqual(Account.objects.get().email, 'toto@hotmail.fr')
