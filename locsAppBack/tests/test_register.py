__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account


# data = {"username": "test", "password1": "Topkek1", "password2": "Topkek1", "email": "mamamia@gmail.co",
# "phone": "0676283782", "is_active": "True", "last_name": "Kekman", "first_name": "Coco",
#        "billing_address": "11 rue des keks", "birthdate": "1990-08-22 11:05:08",
#        "living_address": "11 rue des keks"}

class AccountTestCase(APITestCase):
    def setUp(self):
        self.url = 'http://127.0.0.1:8000/api/v1/rest-auth/registration/'

    def test_create_account(self):
        """
        Ensures we can create a new account object.
        """
        data = {"username": "test", "email": "toto@hotmail.fr", "password1": "toto42", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['key'])
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().username, 'test')
        self.assertEqual(Account.objects.get().email, 'toto@hotmail.fr')

    def test_missing_username(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"email": "toto@hotmail.fr", "password1": "toto42", "password2":"toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'username': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_password(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"username": "test", "email": "toto@hotmail.fr"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)



