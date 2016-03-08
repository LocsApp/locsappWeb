import requests
import json
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from django.http import JsonResponse
from API.models import Account

"""
	Register with Facebook Use the id to register the user
	and find him when login because this id are unique
"""


class FacebookLogin(APIView):
	"""
	We check if the user id present in the facebook token is in our databse
	If yes we log the user
	Else we send an error
	"""

	def post(self, request):
		if "facebook_token" in request.data:
			error = ""
			facebook_token = request.data["facebook_token"]

			r = requests.get(
				"https://graph.facebook.com/v2.5/me?access_token=" +
				facebook_token +
				"&fields=id%2Cname%2Cemail%2Cgender%2Cbirthday&format=json&method=get&pretty=0&suppress_http_code=1")
			profile = json.loads(r.content.decode("utf8"))
			r.close()

			if "id" not in profile:
				return JsonResponse({"message": "Your access_token did not ask for the email"}, status=400)

			print("profile = ", profile["id"])
			try:
				user = Account.object.get(id_facebook=profile["id"])
				# If the user exists we login him and send a token to access to our API

				# Now we check if the token exist
				try:
					# The token exists we need to delete it and create a new one
					old_token = Token.objects.get(user=user)
					old_token.delete()
					new_token = Token.objects.create(user=user)
					return JsonResponse({"message": "Facebook login done", "key": new_token.key, "id": user.pk}, status=201)
				except ObjectDoesNotExist:
					# The token exists we can create a new one safely
					token = Token.objects.create(user=user)
					return JsonResponse({"key": token.key}, status=201)

			except ObjectDoesNotExist:
				return JsonResponse({"message": "This facebook account is not associated with LocsApp"}, status=401)
		else:
			return (JsonResponse(
				{"message": "Please send a Facebook token"}, status=400))


class FacebookRegister(APIView):
	"""
	Register a User wregistrationith Facebook
	First we verify if the maim field are present the token and username
	We check if the username is correct unique, same for id facebook and email. We also check the secondary email
	If all is good we create a user and set it with an unsuable password
	"""

	def post(self, request):
		error = ""
		if "facebook_token" in request.data and "username" in request.data:

			facebook_token = request.data["facebook_token"]
			username = request.data["username"]

			r = requests.get(
				"https://graph.facebook.com/v2.5/me?access_token=" +
				facebook_token +
				"&fields=id%2Cname%2Cemail%2Cgender%2Cbirthday&format=json&method=get&pretty=0&suppress_http_code=1")
			profile = json.loads(r.content.decode("utf8"))
			r.close()

			# We verify the size of the username
			if len(username) < 3:
				error += "Username needs to be at least 3 characters "

			# We verify the user profile contains an email
			if "email" not in profile:
				error += "Your access_token did not ask for the email"

			# We verify an user have the same email1 ALSO VERIFY THE SECONDARY ENMAIL
			if "email" in profile and Account.object.filter(email=profile["email"]):
				error += "An user with this email already exists"

			# We verify the user profile contains and ID
			if "id" not in profile:
				error += "Your access_token do not have any id"

			# We veify an user doest not have an existing facebook ID and we also need to verify the existence of the ID
			if "id" in profile and Account.object.filter(id_facebook=profile["id"]):
				error += "An user with this id already exists"

			# We verify if there is no other user with this username, id_facebook, email or secondary email
			print("username = ", username)
			if Account.object.filter(username=username):
				error += "An user with this username already exists "
			# if Account.object.filter(email=)

			# If there is some error we return a JSON to say it
			if error != "":
				return JsonResponse(
					{"message": error}, status=400
				)

			# If there is no error we register a new user first we check if the field exist and we registered them
			# We know that username, id, and email exist
			new_user = Account.objects.create_user(username=username, email=profile["email"], id_facebook=profile["id"])
			new_user.id_facebook = profile["id"]
			if profile["name"]:
				full_name = profile["name"].split(" ")
				new_user.first_name = full_name[0]
				new_user.last_name = full_name[1]
			if profile["gender"]:
				new_user.gender = profile["gender"]
			if profile["birthday"]:
				new_user.birthdate = profile["birthday"]

			# We set an unusable so the user can only login with Facebook
			new_user.set_unusable_password()
			new_user.save()

			return JsonResponse({"message": "Facebook register done"}, status=201)
		else:
			return (JsonResponse(
				{"message": "Please send a Facebook token and a username"}, status=400))
