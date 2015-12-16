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
#from rest_auth.registration.views import SocialLoginView
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import serializers, exceptions
from rest_auth.views import LoginView
#from rest_auth.registration.serializers import SocialLoginSerializer
from .social_auth_serializer import SocialLoginSerializer

# User model
from django.contrib.auth import get_user_model

# User serializer
from .serializers import UserDetailsSerializer

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

from django.core.validators import validate_email

# Template for the doc on the homepage of the API


class docAPIView(TemplateView):
    template_name = "API/homeDocAPI.html"

"""
    USER PROFILE END-POINTS
"""


@permission_classes((IsAuthenticated, ))
class deleteEmailUser(APIView):

    def post(self, request):
        if ("email" not in request.data or len(request.data["email"]) == 0):
            return Response(
                {"Error": "There must be a field 'email' present in the document."}, status=401)
        answer = request.user.delete_email_address(
            request, request.data["email"])
        if ("Error" in answer):
            return Response(answer, status=401)
        User = get_user_model()
        current_user = User.objects.get(pk=self.request.user.pk)
        serializer = UserDetailsSerializer(current_user)
        dataSerialized = serializer.data
        return Response(dataSerialized)


@permission_classes((IsAuthenticated, ))
class addEmailUser(APIView):

    def post(self, request):
        if ("new_email" not in request.data or len(
                request.data["new_email"]) == 0):
            return Response(
                {"Error": "There must be a field 'new_email' present in the document."}, status=401)
        try:
            validate_email(request.data["new_email"])
        except:
            return Response(
                {"Error": "Please provide a correct email address."})
        if (request.data["new_email"] == request.user.email):
            return Response({"Error": "This is your primary email address."})
        if (request.user.secondary_emails is not None):
            for email_obj in request.user.secondary_emails:
                if (email_obj[0] == request.data["new_email"]):
                    if (email_obj[1] == "true"):
                        return Response(
                            {"Error": "You already confirmed that email."})
                    break
            if (len(request.user.secondary_emails) == 5):
                return Response(
                    {"Error": "Sorry, you can't add more than 5 emails."})
        answer = request.user.add_email_address(
            request, request.data["new_email"], False)
        return Response(answer)


@permission_classes((IsAuthenticated, ))
class setEmailAsPrimary(APIView):

    def post(self, request):
        if ("email" not in request.data or len(request.data["email"]) == 0):
            return Response(
                {"Error": "There must be a field 'email' present in the document."}, status=401)
        if (request.user.secondary_emails is not None):
            User = get_user_model()
            current_user = User.objects.get(pk=self.request.user.pk)
            for email_obj in current_user.secondary_emails:
                if (email_obj[0] == request.data["email"]):
                    if (email_obj[1] == "false"):
                        return (
                            Response({"Error": "This secondary email isn't verified."}))
                    else:
                        temp = email_obj[0]
                        email_obj[0] = current_user.email
                        current_user.email = temp
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        dataSerialized = serializer.data
                        return (Response(dataSerialized))
            return (
                Response({"Error": "You don't have this secondary email."}))
        return (Response({"Error": "You don't have any secondary email."}))


@permission_classes((IsAuthenticated, ))
class livingAddressUser(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if("living_address" in request.data):
            if (isinstance(request.data["living_address"], list)):
                if (len(request.data["living_address"]) == 2):
                    if (len(request.data["living_address"][0]) > 20):
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if (isinstance(request.data["living_address"][1], dict)):
                        if ("first_name" not in request.data["living_address"][1] or
                                "last_name" not in request.data["living_address"][1] or
                                "address" not in request.data["living_address"][1] or
                                "postal_code" not in request.data["living_address"][1] or
                                "city" not in request.data["living_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."}, status=401)
                        else:
                            request.data["living_address"][1] = json.dumps(
                                request.data["living_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.living_address is None or len(
                            current_user.living_address) < 5):
                        if (current_user.living_address is None):
                            current_user.living_address = [
                                request.data["living_address"]]
                        else:
                            for address in current_user.living_address:
                                if (address[0] == request.data["living_address"][
                                        0] or address[1] == request.data["living_address"][1]):
                                    return Response(
                                        {"Error": "The alias or the address already exists"}, status=401)
                            current_user.living_address.append(
                                request.data["living_address"])
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        jsonData = serializer.data
                        return(Response(jsonData))
                    else:
                        return Response(
                            {"Error": "The user already has 5 living addresses"}, status=401)
                else:
                    return Response(
                        {"Error": "The key 'living_address' must have two slots, the first for the alias and the second for the address"}, status=401)
            else:
                return Response(
                    {"Error": "The key 'living_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'living_address' present in the document."}, status=401)
        return Response({"message": "Nice"})

    def get(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        current_user = User.objects.get(pk=user_pk)
        living_addresses = current_user.living_address
        return (Response(living_addresses))


@permission_classes((IsAuthenticated, ))
class livingAddressUserDelete(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if("living_address" in request.data):
            if (isinstance(request.data["living_address"], list)):
                if (len(request.data["living_address"]) == 2):
                    if (len(request.data["living_address"][0]) > 20):
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if (isinstance(request.data["living_address"][1], dict)):
                        if ("first_name" not in request.data["living_address"][1] or
                                "last_name" not in request.data["living_address"][1] or
                                "address" not in request.data["living_address"][1] or
                                "postal_code" not in request.data["living_address"][1] or
                                "city" not in request.data["living_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."}, status=401)
                        else:
                            request.data["living_address"][1] = json.dumps(
                                request.data["living_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.living_address is not None):
                        for i, address in enumerate(
                                current_user.living_address):
                            if (address[0] == request.data[
                                    "living_address"][0]):
                                current_user.living_address.pop(i)
                                current_user.save()
                                serializer = UserDetailsSerializer(
                                    current_user)
                                jsonData = serializer.data
                                return (Response(jsonData))
                        return Response(
                            {"Error": "The alias wasn't found in the user's living addresses"}, status=401)
                    else:
                        return Response(
                            {"Error": "The user has no living address."}, status=401)
                else:
                    return Response(
                        {"Error": "The key 'living_address' must have two slots, the first for the alias and the second for the address"}, status=401)
            else:
                return Response(
                    {"Error": "The key 'living_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'living_address' present in the document."}, status=401)
        return Response({"message": "Nice"})


@permission_classes((IsAuthenticated, ))
class billingAddressUser(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if("billing_address" in request.data):
            if (isinstance(request.data["billing_address"], list)):
                if (len(request.data["billing_address"]) == 2):
                    if (len(request.data["billing_address"][0]) > 20):
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if (isinstance(request.data["billing_address"][1], dict)):
                        if ("first_name" not in request.data["billing_address"][1] or
                                "last_name" not in request.data["billing_address"][1] or
                                "address" not in request.data["billing_address"][1] or
                                "postal_code" not in request.data["billing_address"][1] or
                                "city" not in request.data["billing_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."}, status=401)
                        else:
                            request.data["billing_address"][1] = json.dumps(
                                request.data["billing_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.billing_address is None or len(
                            current_user.billing_address) < 5):
                        if (current_user.billing_address is None):
                            current_user.billing_address = [
                                request.data["billing_address"]]
                        else:
                            for address in current_user.billing_address:
                                if (address[0] == request.data["billing_address"][
                                        0] or address[1] == request.data["billing_address"][1]):
                                    return Response(
                                        {"Error": "The alias or the address already exists"}, status=401)
                            current_user.billing_address.append(
                                request.data["billing_address"])
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        jsonData = serializer.data
                        return(Response(jsonData))
                    else:
                        return Response(
                            {"Error": "The user already has 5 billing addresses"}, status=401)
                else:
                    return Response(
                        {"Error": "The key 'billing_address' must have two slots, the first for the alias and the second for the address"}, status=401)
            else:
                return Response(
                    {"Error": "The key 'billing_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'billing_address' present in the document."}, status=401)
        return Response({"message": "Nice"})

    def get(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        current_user = User.objects.get(pk=user_pk)
        billing_addresses = current_user.billing_address
        return (Response(billing_addresses))


@permission_classes((IsAuthenticated, ))
class billingAddressUserDelete(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if (self.request.user.pk):
            if (int(user_pk) != int(self.request.user.pk)):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if("billing_address" in request.data):
            if (isinstance(request.data["billing_address"], list)):
                if (len(request.data["billing_address"]) == 2):
                    if (len(request.data["billing_address"][0]) > 20):
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if (isinstance(request.data["billing_address"][1], dict)):
                        if ("first_name" not in request.data["billing_address"][1] or
                                "last_name" not in request.data["billing_address"][1] or
                                "address" not in request.data["billing_address"][1] or
                                "postal_code" not in request.data["billing_address"][1] or
                                "city" not in request.data["billing_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."}, status=401)
                        else:
                            request.data["billing_address"][1] = json.dumps(
                                request.data["billing_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.billing_address is not None):
                        for i, address in enumerate(
                                current_user.billing_address):
                            if (address[0] == request.data[
                                    "billing_address"][0]):
                                current_user.billing_address.pop(i)
                                current_user.save()
                                serializer = UserDetailsSerializer(
                                    current_user)
                                jsonData = serializer.data
                                return (Response(jsonData))
                        return Response(
                            {"Error": "The alias wasn't found in the user's living addresses"}, status=401)
                    else:
                        return Response(
                            {"Error": "The user has no billing address."}, status=401)
                else:
                    return Response(
                        {"Error": "The key 'billing_address' must have two slots, the first for the alias and the second for the address"}, status=401)
            else:
                return Response(
                    {"Error": "The key 'billing_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'billing_address' present in the document."}, status=401)
        return Response({"message": "Nice"})

"""
    SOCIAL NETWORK END-POINTS
"""


class SocialLoginView(LoginView):
    """
    class used for social authentications
    example usage for facebook with access_token
    -------------
    from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
    class FacebookLogin(SocialLoginView):
        adapter_class = FacebookOAuth2Adapter
    -------------
    example usage for facebook with code
    -------------
    from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
    from allauth.socialaccount.providers.oauth2.client import OAuth2Client
    class FacebookLogin(SocialLoginView):
        adapter_class = FacebookOAuth2Adapter
         client_class = OAuth2Client
         callback_url = 'localhost:8000'
    -------------
    """
    serializer_class = SocialLoginSerializer


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

    return APIrequests.forgeAPIrequestCreate(
        "POST", request, fields_definition, db_locsapp["articles"])


"""
    PUT END-POINTS
"""


"""
    DELETE END-POINTS
"""


@csrf_exempt
def deleteArticle(request):
    fields_definition = ["name", "id"]
    return APIrequests.forgeAPIrequestDelete(
        request, fields_definition, db_locsapp["articles"])
