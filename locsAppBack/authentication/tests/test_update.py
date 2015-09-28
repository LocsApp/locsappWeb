__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.test import APITestCase
from colorama import init
from colorama import Fore
from authentication.models import Account


init()


class AccountUpdateTest(APITestCase):
    fixtures = ['authentication.json']

    def setUp(self):
        self.url_login = reverse('login')
        self.url_sylflo = '/api/v1/accounts/sylflo/'

    def connexion(self):
        data = {'email': 'dev.chateau@gmail.com', 'password': 'toto'}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_success(self):
        """
        We verify if we can update first and last name
        And after we check if the user can change his password
        :return:
        """
        print(Fore.YELLOW + "\nStart update profile\n")
        print(Fore.RESET)

        self.connexion()

        data = {'email': 'dev.chateau@gmail.com', 'username': 'sylflo', 'name_enterprise': 'toto',
                'phone': '0123456789',
                'address': 'myaddres', 'password': 'toto'}
        response = self.client.put(self.url_sylflo, data, format='json')
        user = Account.object.get(email='dev.chateau@gmail.com')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data, data)

        data = {'email': 'dev.chateau@gmail.com', 'username': 'sylflo', 'name_enterprise': 'toto',
                'phone': '0123456789',
                'address': 'myaddres', 'password': 'toto'}
        response = self.client.put(self.url_sylflo, data, format='json')
        user = Account.object.get(email='dev.chateau@gmail.com')

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_update_error(self):
        """
        If the user is not connected it's impossible to send a put request
        If the user is wrong he can't modify another user profil
        :return:
        """
        print(Fore.YELLOW + "\nStart update pro\n")
        print(Fore.RESET)

        data = {'email': 'dev.chateau@gmail.com', 'username': 'sylflo', 'first_name': 'toto', 'last_name': 'titi',
                'password': 'toto'}
        response = self.client.put(self.url_sylflo, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.connexion()

        data = {'email': 'dev.chateau@gmail.com', 'username': 'sylflo', 'first_name': 'toto', 'last_name': 'titi',
                'password': 'toto'}
        response = self.client.put('/api/v1/accounts/titi/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
