# Create your tests here.

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from colorama import init
from colorama import Fore


init()


class AccountRegisterTest(APITestCase):

    fixtures = ['authentication.json']

    def setUp(self):
        self.url_pass = reverse('forgot-password')

    def test_register_success(self):
        """
        Verify if we can create user
        :return:
        """
        print(Fore.YELLOW + "\nStart register success\n")
        print(Fore.RESET)
        data = {'email': 'toto42@hotmail.fr', 'username': 'toto42', 'name_enterprise': 'name',
                'phone': '0645257525', 'address': 'my address', 'password': 'toto'}
        response = self.client.post('/api/v1/accounts/', data)
        (self.assertEqual(response.status_code, status.HTTP_201_CREATED))
        (self.assertEqual(response.data, data))

    def test_register_existig_user_error(self):
        """
        Verify if a new user tries to register
        He can't register with an already existing username/email
        :return:
        """
        print(Fore.YELLOW + "\nStart register success\n")
        print(Fore.RESET)
        data_error = {'status': 'Bad request', 'message': 'Account could not be created with received data'}
        data = {'email': 'toto42@hotmail.fr', 'username': 'toto', 'first_name': '', 'last_name': '', 'password': 'toto'}
        response = self.client.post('/api/v1/accounts/', data)
        (self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST))
        (self.assertEqual(response.data, data_error))


        data = {'email': 'toto@hotmail.fr', 'username': 'toto42', 'first_name': '', 'last_name': '', 'password': 'toto'}
        response = self.client.post('/api/v1/accounts/', data)
        (self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST))
        (self.assertEqual(response.data, data_error))



    def test_register_username_error(self):
        """
        Verify error registration with username missing
        :return:
        """
        print(Fore.YELLOW + "\nStart register error\n")
        print(Fore.RESET)
        data = {'email': 'toto@hotmail.fr', 'username': '', 'first_name': '', 'last_name': '', 'password': 'toto'}
        data_error = {'status': 'Bad request', 'message': 'Account could not be created with received data'}
        response = self.client.post('/api/v1/accounts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, data_error)

    def test_register_email_error(self):
        """
        Verify error registration with email missing
        :return:
        """
        print(Fore.YELLOW + "\nStart register email error\n")
        print(Fore.RESET)
        data = {'email': '', 'username': 'sylflo', 'first_name': '', 'last_name': '', 'password': 'toto'}
        data_error = {'status': 'Bad request', 'message': 'Account could not be created with received data'}
        response = self.client.post('/api/v1/accounts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, data_error)

    def test_forgot_password_success(self):
        """
        We check if the user can retrive is password
         :return:
         """
        print(Fore.YELLOW + "\nStart verify forgot password\n")
        print(Fore.RESET)
        print("URL = ", self.url_pass)
        data = {'email': 'dev.chateau@gmail.com'}
        response = self.client.put(self.url_pass, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_forgot_password_error(self):
        """
        We check an error is send when the email doesn't exist in the database
        :return:
        """
        print(Fore.YELLOW + "\nStart forgot password mail error\n")
        print(Fore.RESET)
        data = {'email': 'qwedrt@gmail.com'}
        response = self.client.put(self.url_pass, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)















