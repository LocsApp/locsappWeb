from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account


class AccountEditProfileTestCase(APITestCase):

    fixtures = ('test_edit_profile',)

    def setUp(self):
        self.url_user = "http://127.0.01:8000/api/v1/rest-auth/user/"
        self.url_register = "http://127.0.0.1:8000/api/v1/rest-auth/registration/"

    def create_user(self):
        data = {"username": "test", "email": "toto@hotmail.fr", "password1": "toto42", "password2": "toto42"}
        self.client.post(self.url, data, format='json')


    def test_edit_basic(self):
        """
        Ensure we can edit the basics information in the user profile
        """
        data = {""}

