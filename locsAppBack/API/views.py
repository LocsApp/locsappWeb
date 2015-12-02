# Django imports
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.views.generic.base import TemplateView
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView


# Pymongo imports
from pymongo import MongoClient
from bson.objectid import ObjectId

# JSON import
import json

# APIrequestForgery class
from .APIrequest import *

# Instanciation of the APIRequest class
APIrequests = APIRequestMongo()

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']

# Template for the doc on the homepage of the API


class docAPIView(TemplateView):
    template_name = "API/homeDocAPI.html"


"""
    SOCIAL NETWORK END-POINTS
"""


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

#class FacebookRegister(SocialRegisterView):
#    adapter_class = FacebookOAuth2Adapter

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
    fields_definition = \
        {"name": "text, 30",
         "tiny_logo_url": "text, 255",
         "big_logo_url": "text, 255",
         "description": "text, 500",
         "id_author": "integer",
         "date_created": "date",
         "id_type": "integer"}

    return APIrequests.forgeAPIrequestCreate("POST", request, fields_definition, db_locsapp["articles"])


"""
    PUT END-POINTS
"""



"""
    DELETE END-POINTS
"""


@csrf_exempt
def deleteArticle(request):
    fields_definition = ["name", "id"]
    return APIrequests.forgeAPIrequestDelete(request, fields_definition, db_locsapp["articles"])