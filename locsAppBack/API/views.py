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

#APIrequestForgery class
from .APIrequest import *

#Instanciation of the APIRequest class
APIrequests = APIRequestMongo()

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']

# Template for the doc on the homepage of the API
class docAPIView(TemplateView):
	template_name = "API/homeDocAPI.html"

"""
	GET END-POINTS
"""

"""
	POST END-POINTS
"""

""" Articles """

# Creates a new article
@csrf_exempt
def postNewArticle(request):
	fields_definition = {"name", "tiny_logo_url", "big_logo_url",
	 "description", "id_author", "date_created", "id_type"}

	return APIrequests.forgeAPIrequestCreatePOST(request, fields_definition, db_locsapp["articles"])


"""
	PUT END-POINTS
"""

"""
	DELETE END-POINTS
"""