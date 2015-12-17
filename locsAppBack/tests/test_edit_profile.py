from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from API.models import Account


class AccountEditProfileTestCase(APITestCase):

    fixtures = ('test_edit_profile',)

    def setUp(self):
        self.url_user = "http://127.0.01:8000/api/v1/rest-auth/user/"
        self.url_register = "http://127.0.0.1:8000/api/v1/rest-auth/registration/"
        self.url_login = "http://localhost:8000/api/v1/rest-auth/login/"

    def login_user(self):
        data = {"username": "locsapp", "password": "toto42"}
        response = self.client.post(self.url_login, data, format='json')
        return response.data['key']

    def test_edit_basic(self):
        """
        Ensure we can edit the basics information in the user profile
        """
        key = self.login_user()
        data = {"first_name": "LocsApp"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.put(self.url_user, {"first_name": "toto"}, **header)
        """client.credentials(HTTP_AUTHORIZATION='Token ' + key)
        response = self.client.get(self.url_user, data, format='json')"""
        print(response.data)
