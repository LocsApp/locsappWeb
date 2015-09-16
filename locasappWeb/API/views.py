from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.http import JsonResponse
from django.http import HttpResponse

# Template for the doc on the homepage of the API
class docAPIView(TemplateView):
	template_name = "API/homeDocAPI.html"

# gets a user by its id
def getUserById(request, id):
	return (JsonResponse({"id" : id}))