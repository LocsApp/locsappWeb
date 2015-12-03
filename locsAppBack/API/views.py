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
from rest_framework.views import APIView
from rest_framework.decorators import  permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# User model
from django.contrib.auth import get_user_model

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
    USER PROFILE END-POINTS
"""
@permission_classes((IsAuthenticated, ))
class AddNewLivingAddressUser(APIView):
    def post(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response({"Unauthorized" : "You have no access to this data."}, status=403)
        else:
            return Response({"Unauthorized" : "You need to be connected."}, status=403)
        if("living_address" in request.data):
            print(request.data)
        else:
            return Response({"Error" : "There must be a key 'living_address' present in the document"}, status=401)

        return Response({"message" : "Nice"})


"""
    SOCIAL NETWORK END-POINTS
"""


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter


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