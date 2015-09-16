#Django imports
from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.http import JsonResponse
from django.http import HttpResponse

#Pymongo imports
from pymongo import MongoClient

mongodb_client = MongoClient('localhost', 27017)

# Template for the doc on the homepage of the API
class docAPIView(TemplateView):
	template_name = "API/homeDocAPI.html"

# gets a user by its id
def getUserById(request, id):
	return (JsonResponse({"id" : id}))