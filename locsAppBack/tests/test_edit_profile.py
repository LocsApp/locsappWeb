from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from API.models import Account


class AccountEditProfileTestCase(APITestCase):

    fixtures = ('test_edit_profile',)

    def setUp(self):
        self.url_user = "http://127.0.01:8000/api/v1/rest-auth/user/"
        self.url_register = "http://127.0.0.1:8000/api/v1/rest-auth/registration/"
        self.url_login = "http://localhost:8000/api/v1/rest-auth/login/"
        self.url_change_password = "http://localhost:8000/api/v1/rest-auth/password/change/"

    def login_user(self):
        data = {"username": "locsapp", "password": "toto42"}
        response = self.client.post(self.url_login, data, format='json')
        return response.data['key']

    def test_edit_basic(self):
        """
        Ensure we can edit the basics information in the user profile
        """
        key = self.login_user()
        data = {"username": "toto", "email": "tutu@hotmail.fr", "first_name": "LocsApp", "last_name": "Last name",
                "birthdate": "1990/11/16", "logo_url": "avatar.jpg", "is_active": "false", "role": "admin",
                "secondary_emails:": ["toto", "toto@hotmmail.fr"], "registered_date": "2014/07/15",
                "last_activity_date": "2014/08/25"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.put(self.url_user, data, **header)

        self.assertNotEqual(response.data['username'], "toto")
        self.assertNotEqual(response.data['email'], "tutu@hotmail.fr")
        self.assertEqual(response.data['first_name'], "LocsApp")
        self.assertEqual(response.data['last_name'], "Last name")
        self.assertEqual(response.data['birthdate'], "1990/11/16")
        self.assertNotEqual(response.data['logo_url'], "avatar.jpg")
        self.assertNotEqual(response.data['is_active'], False)
        self.assertNotEqual(response.data['role'], "admin")
        self.assertNotEqual(response.data['secondary_emails'], ["toto", "toto@hotmmail.fr"])
        self.assertNotEqual(response.data['registered_date'], "2014/07/15")
        self.assertNotEqual(response.data['last_activity_date'], "2014/08/25")

        self.assertEqual(response.status_code, 200)

    def test_change_password(self):
        """
        Ensure we can change the password and the user can't logged with the old password
        """
        key = self.login_user()
        data = {"old_password": "toto42", "new_password1": "locsapp", "new_password2": "locsapp"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.post(self.url_change_password, data, **header)
        self.assertEqual({'success': 'New password has been saved.'}, response.data)
        self.assertEqual(response.status_code, 200)

        data = {"username": "locsapp", "password": "toto42"}
        response = self.client.post(self.url_login, data, format='json')
        self.assertEqual(response.status_code, 400)

        data = {"username": "locsapp", "password": "locsapp"}
        response = self.client.post(self.url_login, data, format='json')
        self.assertTrue(response.data['key'])
        self.assertEqual(response.status_code, 200)

    def test_change_password_not_the_same(self):
        """
        Ensure there is an error when putting diffrent password
        """
        key = self.login_user()
        data = {"old_password": "toto42", "new_password1": "locsapp", "new_password2": "locsapp42"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.post(self.url_change_password, data, **header)
        self.assertEqual({'new_password2': ["The two password fields didn't match."]}, response.data)
        self.assertEqual(response.status_code, 400)

    def test_change_password_wrong(self):
        """
        Ensure there is an error if the user post a wrong actual password
        """
        key = self.login_user()
        data = {"old_password": "locsapp", "new_password1": "locsapp", "new_password2": "locsapp"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.post(self.url_change_password, data, **header)
        self.assertEqual({'old_password': ['Invalid password']}, response.data)
        self.assertEqual(response.status_code, 400)

    def test_change_password_too_small(self):
        """
        Ensure there is an error when the new password is too small
        """
        key = self.login_user()
        data = {"old_password": "toto42", "new_password1": "toto", "new_password2": "toto"}
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(key)}
        response = self.client.post(self.url_change_password, data, **header)
        self.assertEqual({'non_field_errors': ['Password must be a minimum of 6 characters.']}, response.data)
        self.assertEqual(response.status_code, 400)






