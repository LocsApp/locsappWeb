__author__ = 'sylflo'

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.test import Client, TestCase
from colorama import Fore
from colorama import init


init()


class AccountLogoutTest(APITestCase):
    fixtures = ['authentication.json']

    def setUp(self):
        self.url_logout = reverse('logout')
        self.url_login = reverse('login')

    def test_logout_error(self):
        """
        If user not authenticated tries to logout
        we send an error
        :return:
        """
        print(Fore.YELLOW + "\nStart logout error not connected\n")
        print(Fore.RESET)

        response = self.client.post(self.url_logout, data=None)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_success(self):
        """
        If user is authenticated and wants to logout
        :return:
        """
        print(Fore.YELLOW + "\nStart logout error not connected\n")
        print(Fore.RESET)

        data = {'email': 'dev.chateau@gmail.com', 'password': 'toto'}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.url_logout, data=None)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


