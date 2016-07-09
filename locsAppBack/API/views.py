# Django imports

from django.views.generic.base import TemplateView
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Account
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import logout

from django.conf import settings

from django.views.decorators.csrf import csrf_exempt

# User model
from django.contrib.auth import get_user_model
# User serializer
from .serializers import UserDetailsSerializer
# Pymongo imports
from pymongo import MongoClient
# JSON import
# APIrequestForgery class
from .APIrequest import *
from django.core.validators import validate_email
import json
from bson import ObjectId
from rest_framework.parsers import FileUploadParser
import uuid
import os
import datetime
import hashlib
import shutil


# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']

# Instanciation of the APIRequest class
APIrequests = APIRequestMongo(db_locsapp)


class JSONEncoder(json.JSONEncoder):

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


# Template for the doc on the homepage of the API
class docAPIView(TemplateView):
    template_name = "API/homeDocAPI.html"


"""
    USER PROFILE ENDPOINTS
"""


@permission_classes((IsAuthenticated,))
class GetNotationPreviewArticle(APIView):

    def get(self, request):
        get_user_model().objects.get(pk=self.request.user.pk)
        # First we get the username id and with this we can get the notation


@permission_classes((IsAuthenticated,))
class deleteEmailUser(APIView):

    def post(self, request):
        if "email" not in request.data or len(request.data["email"]) == 0:
            return Response(
                {"Error": "There must be a field 'email' present in the document."}, status=401)
        answer = request.user.delete_email_address(
            request, request.data["email"])
        if "Error" in answer:
            return Response(answer, status=401)
        User = get_user_model()
        current_user = User.objects.get(pk=self.request.user.pk)
        serializer = UserDetailsSerializer(current_user)
        dataSerialized = serializer.data
        if "Error" in answer:
            return Response(answer, status=401)
        return Response(dataSerialized)


@permission_classes((IsAuthenticated,))
class addEmailUser(APIView):

    def post(self, request):
        if ("new_email" not in request.data or len(
                request.data["new_email"]) == 0):
            return Response(
                {"Error": "There must be a field 'new_email' present in the document."},
                status=401)
        try:
            validate_email(request.data["new_email"])
        except:
            return Response(
                {"Error": "Please provide a correct email address."}, status=401)
        if request.data["new_email"] == request.user.email:
            return Response(
                {"Error": "This is your primary email address."}, status=401)
        if request.user.secondary_emails is not None:
            for email_obj in request.user.secondary_emails:
                if email_obj[0] == request.data["new_email"]:
                    if email_obj[1] == "true":
                        return Response(
                            {"Error": "You already confirmed that email."}, status=401)
                    break
            if len(request.user.secondary_emails) == 5:
                return Response(
                    {"Error": "Sorry, you can't add more than 5 emails."}, status=401)
        answer = request.user.add_email_address(
            request, request.data["new_email"], False)
        if "Error" in answer:
            return Response(answer, status=401)
        return Response(answer)


@permission_classes((IsAuthenticated,))
class setEmailAsPrimary(APIView):

    def post(self, request):
        if "email" not in request.data or len(request.data["email"]) == 0:
            return Response(
                {"Error": "There must be a field 'email' present in the document."}, status=401)
        if request.user.secondary_emails is not None:
            User = get_user_model()
            current_user = User.objects.get(pk=self.request.user.pk)
            for email_obj in current_user.secondary_emails:
                if email_obj[0] == request.data["email"]:
                    if email_obj[1] == "false":
                        return (
                            Response({"Error": "This secondary email isn't verified."},
                                     status=401))
                    else:
                        temp = email_obj[0]
                        email_obj[0] = current_user.email
                        current_user.email = temp
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        dataSerialized = serializer.data
                        return Response(dataSerialized)
            return (
                Response({"Error": "You don't have this secondary email."}, status=401))
        return (
            Response({"Error": "You don't have any secondary email."}, status=401))


@permission_classes((IsAuthenticated,))
class livingAddressUser(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if "living_address" in request.data:
            if isinstance(request.data["living_address"], list):
                if len(request.data["living_address"]) == 2:
                    if len(request.data["living_address"][0]) > 20:
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if isinstance(request.data["living_address"][1], dict):
                        if ("first_name" not in request.data["living_address"][1] or
                                "last_name" not in request.data["living_address"][1] or
                                "address" not in request.data["living_address"][1] or
                                "postal_code" not in request.data["living_address"][1] or
                                "city" not in request.data["living_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."},
                                status=401)
                        else:
                            request.data["living_address"][1] = json.dumps(
                                request.data["living_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.living_address is None or len(
                            current_user.living_address) < 5):
                        if current_user.living_address is None:
                            current_user.living_address = [
                                request.data["living_address"]]
                        else:
                            for address in current_user.living_address:
                                if (address[0] == request.data["living_address"][
                                        0] or address[1] == request.data["living_address"][1]):
                                    return Response(
                                        {"Error": "The alias or the address already exists"},
                                        status=401)
                            current_user.living_address.append(
                                request.data["living_address"])
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        jsonData = serializer.data
                        return Response(jsonData)
                    else:
                        return Response(
                            {"Error": "The user already has 5 living addresses"}, status=401)
                else:
                    return Response(
                        {
                            "Error": "The key 'living_address' must have two slots, the first for the alias and"
                                     " the second for the address"},
                        status=401)
            else:
                return Response(
                    {"Error": "The key 'living_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'living_address' present in the document."},
                status=401)
        return Response({"message": "Nice"})

    def get(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        current_user = User.objects.get(pk=user_pk)
        living_addresses = current_user.living_address
        return Response(living_addresses)


@permission_classes((IsAuthenticated,))
class livingAddressUserDelete(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if "living_address" in request.data:
            if isinstance(request.data["living_address"], list):
                if len(request.data["living_address"]) == 2:
                    if len(request.data["living_address"][0]) > 20:
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if isinstance(request.data["living_address"][1], dict):
                        if ("first_name" not in request.data["living_address"][1] or
                                "last_name" not in request.data["living_address"][1] or
                                "address" not in request.data["living_address"][1] or
                                "postal_code" not in request.data["living_address"][1] or
                                "city" not in request.data["living_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."},
                                status=401)
                        else:
                            request.data["living_address"][1] = json.dumps(
                                request.data["living_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if current_user.living_address is not None:
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
                            {"Error": "The alias wasn't found in the user's living addresses"},
                            status=401)
                    else:
                        return Response(
                            {"Error": "The user has no living address."}, status=401)
                else:
                    return Response(
                        {
                            "Error": "The key 'living_address' must have two slots, the first for"
                                     " the alias and"
                                     " the second for the address"},
                        status=401)
            else:
                return Response(
                    {"Error": "The key 'living_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'living_address' present in the document."},
                status=401)
        return Response({"message": "Nice"})


@permission_classes((IsAuthenticated,))
class billingAddressUser(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if "billing_address" in request.data:
            if isinstance(request.data["billing_address"], list):
                if len(request.data["billing_address"]) == 2:
                    if len(request.data["billing_address"][0]) > 20:
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if isinstance(request.data["billing_address"][1], dict):
                        if ("first_name" not in request.data["billing_address"][1] or
                                "last_name" not in request.data["billing_address"][1] or
                                "address" not in request.data["billing_address"][1] or
                                "postal_code" not in request.data["billing_address"][1] or
                                "city" not in request.data["billing_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."},
                                status=401)
                        else:
                            request.data["billing_address"][1] = json.dumps(
                                request.data["billing_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if (current_user.billing_address is None or len(
                            current_user.billing_address) < 5):
                        if current_user.billing_address is None:
                            current_user.billing_address = [
                                request.data["billing_address"]]
                        else:
                            for address in current_user.billing_address:
                                if address[0] == request.data["billing_address"][0] or address[1] \
                                        == request.data["billing_address"][1]:
                                    return Response(
                                        {"Error": "The alias or the address already exists"},
                                        status=401)
                            current_user.billing_address.append(
                                request.data["billing_address"])
                        current_user.save()
                        serializer = UserDetailsSerializer(current_user)
                        jsonData = serializer.data
                        return Response(jsonData)
                    else:
                        return Response(
                            {"Error": "The user already has 5 billing addresses"}, status=401)
                else:
                    return Response(
                        {
                            "Error": "The key 'billing_address' must have two slots, the first"
                                     " for the alias"
                                     " and the second for the address"},
                        status=401)
            else:
                return Response(
                    {"Error": "The key 'billing_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'billing_address' present in the document."},
                status=401)
        return Response({"message": "Nice"})

    def get(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        current_user = User.objects.get(pk=user_pk)
        billing_addresses = current_user.billing_address
        return Response(billing_addresses)


class checkStaticCollectionVersion(APIView):

    def post(self, request, argument):
        if (int(argument) != 1):
            verificator = None
            if (not "version" in request.data):
                return Response(
                    {"Error": "You need to provide the version of the cache."})
            try:
                verificator = datetime.datetime.strptime(request.data[
                    "version"], '%Y-%m-%dT%H:%M:%S')
            except:
                return Response(
                    {"Error": "You need to provide a correct version for the cache."})
        if (int(argument) == 1 or not isinstance(verificator, type(
                settings.STATIC_COLLECTION_VERSION)) or verificator != settings.STATIC_COLLECTION_VERSION):
            static_collections = {}
            static_collections.update(APIrequests.GET(
                "base_categories", raw=True))
            static_collections.update(APIrequests.GET(
                "sub_categories", raw=True))
            static_collections.update(APIrequests.GET(
                "clothe_colors", raw=True))
            static_collections.update(APIrequests.GET(
                "clothe_states", raw=True))
            static_collections.update(APIrequests.GET(
                "genders", raw=True))
            static_collections.update(APIrequests.GET(
                "payment_methods", raw=True))
            static_collections.update(APIrequests.GET(
                "sizes", raw=True))
            return Response(
                {"up_to_date": False, "static_collections": static_collections, "version": settings.STATIC_COLLECTION_VERSION})
        else:
            return Response({"up_to_date": True})


@permission_classes((IsAuthenticated,))
class billingAddressUserDelete(APIView):

    def post(self, request, user_pk):
        User = get_user_model()
        if self.request.user.pk:
            if int(user_pk) != int(self.request.user.pk):
                return Response(
                    {"Unauthorized": "You have no access to this data."}, status=403)
        else:
            return Response(
                {"Unauthorized": "You need to be connected."}, status=403)
        if "billing_address" in request.data:
            if isinstance(request.data["billing_address"], list):
                if len(request.data["billing_address"]) == 2:
                    if len(request.data["billing_address"][0]) > 20:
                        return Response(
                            {"Error": "Aliases must be smaller than 20 characters"}, status=401)
                    if isinstance(request.data["billing_address"][1], dict):
                        if ("first_name" not in request.data["billing_address"][1] or
                                "last_name" not in request.data["billing_address"][1] or
                                "address" not in request.data["billing_address"][1] or
                                "postal_code" not in request.data["billing_address"][1] or
                                "city" not in request.data["billing_address"][1]):
                            return Response(
                                {"Error": "Address collection is not correctly formatted."},
                                status=401)
                        else:
                            request.data["billing_address"][1] = json.dumps(
                                request.data["billing_address"][1])
                    else:
                        return Response(
                            {"Error": "Addresses must be a collection of data"}, status=401)
                    current_user = User.objects.get(pk=user_pk)
                    if current_user.billing_address is not None:
                        for i, address in enumerate(
                                current_user.billing_address):
                            if (address[0] == request.data[
                                    "billing_address"][0]):
                                current_user.billing_address.pop(i)
                                current_user.save()
                                serializer = UserDetailsSerializer(
                                    current_user)
                                jsonData = serializer.data
                                return Response(jsonData)
                        return Response(
                            {"Error": "The alias wasn't found in the user's living addresses"},
                            status=401)
                    else:
                        return Response(
                            {"Error": "The user has no billing address."}, status=401)
                else:
                    return Response(
                        {
                            "Error": "The key 'billing_address' must have two slots, the first for"
                                     " the alias and the second for the address"},
                        status=401)
            else:
                return Response(
                    {"Error": "The key 'billing_address' must be a list."}, status=401)
        else:
            return Response(
                {"Error": "There must be a key 'billing_address' present in the document."},
                status=401)
        return Response({"message": "Nice"})


@csrf_exempt
def searchNotificationsUser(request, user_pk):
    """
    if (request.user.pk):
        if (int(user_pk) != int(request.user.pk)):
            return JsonResponse(
                {"Unauthorized": "You have no access to this data."}, status=403)
    else:
        return JsonResponse(
            {"Unauthorized": "You need to be connected."}, status=403)
    """

    if request.method == "POST":
        JSONdoc = json.loads(request.body.decode('utf8'))
        if ("page" in JSONdoc and
                "number_items" in JSONdoc):
            if (not isinstance(JSONdoc["page"], type(1)) or not
                    isinstance(JSONdoc["number_items"], type(1))):
                return (JsonResponse(
                    {"Error": "'page' and 'number_items' must be numbers."}, status=401))
            page = JSONdoc["page"]
            number_items = JSONdoc["number_items"]
            notifications_user = db_locsapp[
                "notifications_users"].find({"user_id": int(user_pk),
                                             "visible": True}).sort(
                "date", -1)[((page - 1) * number_items):((page - 1) * number_items) + number_items]
            notifications_metadata = {"new": db_locsapp[
                "notifications_users"].find({"user_id": int(user_pk), "read": False,
                                             "visible": True}).count()}
            notifications_metadata["total"] = db_locsapp[
                "notifications_users"].find({"user_id": int(user_pk), "visible": True}).count()
            notifications = {
                "notifications": [],
                "metadatas": notifications_metadata}
            for notification in notifications_user:
                notification = APIrequests.parseObjectIdToStr(notification)
                notifications["notifications"].append(notification)
            return JsonResponse(notifications, safe=True)
        else:
            return (JsonResponse(
                {"Error": "There must be a key 'page' and 'number_items' present in the"
                          " JSON document."}, status=401))
    else:
        return (JsonResponse(
            {"Error": "405 METHOD NOT ALLOWED"}, status=405))


@csrf_exempt
def notificationsUserAllRead(request, user_pk):
    """
    if (request.user.pk):
        if (int(user_pk) != int(request.user.pk)):
            return JsonResponse(
                {"Unauthorized": "You have no access to this data."}, status=403)
    else:
        return JsonResponse(
            {"Unauthorized": "You need to be connected."}, status=403)
    """

    if request.method == "GET":
        nb_modified = db_locsapp["notifications_users"].update_many(
            {'user_id': int(user_pk)}, {"$set": {"read": True}})
        if nb_modified.modified_count <= 0:
            return (JsonResponse(
                {"Warning": "No notification has been modified. Reason :"
                            " No notifications were available."}))
        return (JsonResponse(
            {"message": "Notifications successfully updated!", "nb_modified":
                nb_modified.modified_count}))
    else:
        return (JsonResponse(
            {"Error": "405 METHOD NOT ALLOWED"}, status=405))


@csrf_exempt
def notificationsUser(request, user_pk):
    fields_definition = {
        "type": "text, 30",
        "content": "text, 300",
        "state_url": "text, 50",
        "read": "boolean",
        "visible": "boolean",
        "user_id": "integer",
        "date": "date_default"
    }

    """
    if (request.user.pk):
        if (int(user_pk) != int(request.user.pk)):
            return JsonResponse(
                {"Unauthorized": "You have no access to this data."}, status=403)
    else:
        return JsonResponse(
            {"Unauthorized": "You need to be connected."}, status=403)
    """
    if request.method == "POST":
        return APIrequests.forgeAPIrequestCreate(
            "POST", request, fields_definition, db_locsapp["notifications_users"])
    elif request.method == "GET":
        notifications_user = db_locsapp[
            "notifications_users"].find({"user_id": int(user_pk), "visible": True}).sort("date", -1)
        notifications_metadata = {"new": db_locsapp[
            "notifications_users"].find({"user_id": int(user_pk), "read": False,
                                         "visible": True}).count()}
        notifications_metadata["total"] = db_locsapp[
            "notifications_users"].find({"user_id": int(user_pk), "visible": True}).count()
        notifications = {
            "notifications": [],
            "metadatas": notifications_metadata}
        for notification in notifications_user:
            notification = APIrequests.parseObjectIdToStr(notification)
            notifications["notifications"].append(notification)
        return JsonResponse(notifications, safe=True)
    elif request.method == "DELETE":
        nb_deleted = db_locsapp["notifications_users"].update_many(
            {'user_id': int(user_pk)}, {"$set": {"visible": False}})
        if nb_deleted.modified_count <= 0:
            return (JsonResponse(
                {"Warning": "No notification has been deleted. Reason :"
                            " No notifications were available."}))
        return (JsonResponse(
            {"message": "Notifications successfully deleted!", "nb_deleted":
                nb_deleted.modified_count}))
    else:
        return (JsonResponse(
            {"Error": "405 METHOD NOT ALLOWED"}, status=405))


"""
    NOTIFICATIONS ENDPOINTS
"""


@csrf_exempt
def notificationAlone(request, notification_pk):
    fields_definition_put = {
        "type": "text, 30",
        "content": "text, 300",
        "state_url": "text, 50",
        "read": "boolean",
        "visible": "boolean",
        "user_id": "integer"
    }

    if request.method == "GET":
        notification = db_locsapp["notifications_users"].find_one(
            {"_id": ObjectId(notification_pk)})
        answer = APIrequests.parseObjectIdToStr(notification)
        if answer is not None:
            return JsonResponse(answer, safe=True)
        else:
            return JsonResponse({"Error": "Id not found."}, status=404)
    elif request.method == "PUT":
        return APIrequests.forgeAPIrequestPut(
            request, notification_pk, fields_definition_put, db_locsapp["notifications_users"])
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


class ImageAvatarUploadView(APIView):
    parser_classes = (FileUploadParser, )

    def post(self, request, format="image/*"):
        if (not "file" in request.data):
            return JsonResponse(
                {"Error": "There is no field file in the document."}, status=403)
        up_file = request.data["file"]
        destination_url = settings.MEDIA_ROOT + hashlib.md5(
            request.user.username.encode('utf-8')).hexdigest() + '/avatar.jpg'
        print(os.path.dirname(destination_url))
        if os.path.isdir(os.path.dirname(destination_url)):
            shutil.rmtree(os.path.dirname(destination_url))
            print("File exist we need to delete it")
            print(os.path.dirname(destination_url))

        os.makedirs(os.path.dirname(destination_url))
        destination = open(destination_url, 'wb+')
        for chunk in up_file.chunks():
            destination.write(chunk)
            destination.close()

        get_user_model().objects.filter(
            pk=request.user.pk).update(
            logo_url=settings.URL_BACK + 'media/' +
            hashlib.md5(
                request.user.username.encode('utf-8')).hexdigest() +
            '/avatar.jpg')
        return JsonResponse({"url_avatar": settings.URL_BACK + 'media/' + hashlib.md5(
            request.user.username.encode('utf-8')).hexdigest() + '/avatar.jpg'})


class ImageArticleUploadView(APIView):
    parser_classes = (FileUploadParser, )

    def post(self, request, format="image/*"):
        if (not "file" in request.data):
            return JsonResponse(
                {"Error": "There is no field file in the document."}, status=403)
        up_file = request.data["file"]
        dir_location = settings.MEDIA_ROOT + 'articles/'
        os.makedirs(os.path.dirname(dir_location), exist_ok=True)
        unique_id = uuid.uuid4().hex
        destination_url = settings.MEDIA_ROOT + 'articles/' + unique_id
        destination = open(destination_url, 'wb+')
        for chunk in up_file.chunks():
            destination.write(chunk)
            destination.close()
        answer_url = 'media/articles/' + unique_id
        return JsonResponse({"url": answer_url})

"""
    SOCIAL NETWORK ENDPOINTS
"""

"""
    GET END-POINTS
"""

"""
    POST END-POINTS
"""

"""
    PUT END-POINTS
"""

"""
    DELETE END-POINTS
"""


@csrf_exempt
def delete_Article(request):
    fields_definition = ["name", "id"]
    return APIrequests.forgeAPIrequestDelete(
        request, fields_definition, db_locsapp["articles"])
