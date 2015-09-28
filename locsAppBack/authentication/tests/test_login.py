__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from colorama import Fore
from colorama import init

init()


class AccountLoginTest(APITestCase):

    fixtures = ['authentication.json']

    def setUp(self):
        self.url_login = reverse('login')

    def test_login_creditential_error(self):
        """
        We check if an error is send
        when the user enters wrong email/password
        :return:
        """
        print(Fore.YELLOW + "\nStart login creditential error\n")
        print(Fore.RESET)
        data = {'username': 'MyUsername'}
        data_error = {'status': 'Unauthorized',
                      'message': 'Username/password combination invalid'}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, data_error)

    def test_login_active_error(self):
        """
        We check if an error is send
        when the users is not active
        :return:
        """
        print(Fore.YELLOW + "\nStart login no active error")
        print(Fore.RESET)
        data = {'email': 'toto@hotmail.fr', 'password': 'toto'}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_success(self):
        """
        We check the user can log in
        :return:
        """
        print(Fore.YELLOW + "\n Start login success\n")
        data = {'email': 'dev.chateau@gmail.com', 'password': 'toto'}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


