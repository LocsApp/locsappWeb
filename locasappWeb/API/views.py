#Django imports
from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

#Pymongo imports
from pymongo import MongoClient
from bson.objectid import ObjectId

#JSON import
import json

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']

# Template for the doc on the homepage of the API
class docAPIView(TemplateView):
	template_name = "API/homeDocAPI.html"

"""
	GET END-POINTS
"""
# Gets a user by its id
def getUserById(request, id):
	return (JsonResponse({"id" : id}))

"""
	POST END-POINTS
"""

# Subscribe a new user
@csrf_exempt
def postSubscribeNewUser(request):
	users_collection = db_locsapp['users']
	new_user = {}
	answer = json.loads(request.body.decode('utf-8'))
	new_user["gender"] = answer["gender"]
	users_collection.insert_one(new_user)
	"""
	except:
		return (HttpResponse("400 Bad Request"))
	"""
	return (HttpResponse("200 OK"))

# Deletes a user with the given id
@csrf_exempt
def postDeleteUserById(request):
	users_collection = db_locsapp['users']
	answer = json.loads(request.body.decode('utf-8'))
	users_collection.remove({"_id" : ObjectId(answer["id"])})
	return (HttpResponse("200 OK"))