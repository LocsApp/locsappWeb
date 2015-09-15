from django.shortcuts import render
from django.views.generic.base import TemplateView

class docAPIView(TemplateView):
	template_name = "API/homeDocAPI.html"