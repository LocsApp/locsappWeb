__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account


# data = {"username": "test", "password1": "Topkek1", "password2": "Topkek1", "email": "mamamia@gmail.co",
# "phone": "0676283782", "is_active": "True", "last_name": "Kekman", "first_name": "Coco",
# "billing_address": "11 rue des keks", "birthdate": "1990-08-22 11:05:08",
#        "living_address": "11 rue des keks"}

class AccountRegisterTestCase(APITestCase):
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
        Ensures we send an error when username is missing for register
        """
        data = {"email": "toto@hotmail.fr", "password1": "toto42", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'username': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_email(self):
        """
        Ensures we send an error when email is missing for register
        """
        data = {"username": "toto", "password1": "toto42", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'email': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_not_valid_email(self):
        """
        Ensures we send an error when email is not valid for register
        """
        data = {"email": "toto", "username": "toto", "password1": "toto42", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'email': ['Enter a valid email address.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_the_two_password(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"email": "toto@hotmail.fr", "username": "toto"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_password2(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password1": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'password2': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_password1(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'password1': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_missing_password1(self):
        """
        Ensures we send an error when password is missing for register
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'password1': ['This field is required.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_password_too_short_with_two_password(self):
        """
        Ensures we send an error when password is too short for register and when we have the two password
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password1": "toto", "password2": "toto"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'password1': ['Password must be a minimum of 6 characters.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_password_too_short_with_password1(self):
        """
        Ensures we send an error when password is too short for register and when we have the two password
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password1": "toto", "password2": "toto42"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual({'password1': ['Password must be a minimum of 6 characters.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)

    def test_password_different(self):
        """
        Ensures we send an error when password are different for register
        """
        data = {"email": "toto@hotmail.fr", "username": "toto", "password1": "toto42", "password2": "toto4"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual( {'__all__': ['You must type the same password each time.']}, response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Account.objects.count(), 0)