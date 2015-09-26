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

"""
	POST END-POINTS
"""

""" Articles """

# Creates a new article
@csrf_exempt
def postNewArticle(request):
	if (request.body):
		answer = json.loads(request.body.decode('utf8'))
		print(answer)
		return(HttpResponse("200 OK"))
	else:
		return (HttpResponse("400 BAD REQUEST"))

"""
	PUT END-POINTS
"""

"""
	DELETE END-POINTS
"""