from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from API.models import Account

class AccountTests(APITestCase):
	def test_create_account(self):
		"""
		Ensures we can create a new account object.
		"""
		url = "http://127.0.0.1:8000/api/v1/rest-auth/registration/"
		data = {"username" : "test", "password1" : "Topkek1", "password2" : "Topkek1", "email" : "mamamia@gmail.co", "phone" : "0676283782", "is_active": "True", "last_name": "Kekman", "first_name": "Coco", "billing_address": "11 rue des keks", "birthdate": "1990-08-22 11:05:08", "living_address": "11 rue des keks", "logo_url" : "/kek/"}
		response = self.client.post(url, data, format='json')
		try:
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		except:
			self.assertEqual(response.data, {})
		self.assertEqual(Account.objects.count(), 1)
		self.assertEqual(Account.objects.get().username, 'test')
