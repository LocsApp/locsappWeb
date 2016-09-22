from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .views import db_locsapp
from .views import APIrequests
from .APIrequest import paginationAPI
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.conf import settings
from .utility import Utility
import math


from dateutil.parser import parse

import json
from bson import ObjectId
from bson import json_util

import pytz
from datetime import datetime
import re
from django.http import HttpResponse

from django.contrib.auth import get_user_model

from pymongo import MongoClient
from pymongo import ASCENDING, DESCENDING

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']


""" Seller Article """


class FindUserByIdForArticle(APIView):

    def get(self, request, user_pk):
        try:
            user = get_user_model().object.get(pk=user_pk)
            return JsonResponse({"username": user.username, "notation_renter": "4",
                                 "nb_notation_renter": "50"}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "user id does not exist"}, status=404)


""" Articles """

# Creates a new article


@csrf_exempt
@api_view(['POST'])
def searchArticles(request):
    document = {"metadatas": {}, "articles": []}
    body = json.loads(request.body.decode('utf8'))
    search = {}
    print(body)
    if (not "_pagination" in body or not isinstance(
            body["_pagination"], type({}))):
        return JsonResponse(
            {"Error": "You need a _pagination dict in your document."})
    if (not "page_number" in body["_pagination"]
            or not "items_per_page" in body["_pagination"]):
        return JsonResponse(
            {"Error": "The pagination is not in the correct format."})
    ordering = []
    if ("_order" in body):
        if (not isinstance(body["_order"], type([]))):
            return JsonResponse({"Error": "The order must be a list."})
        for fields_order in body["_order"]:
            if (not isinstance(fields_order, type({})) or len(fields_order.keys()) != 2 or not "order" in fields_order or not "field_name" in fields_order or not isinstance(
                    fields_order["order"], str) or not isinstance(fields_order["field_name"], str)):
                return JsonResponse(
                    {"Error": "The order is not correctly formated."})
            order_temp = None
            print ("INNIT")
            if (fields_order["order"] == "ASC"):
                order_temp = 1
            else:
                order_temp = -1
            ordering.append((fields_order["field_name"], order_temp))
    for key in body:
        if key != "_pagination" and key != "_order":
            if key == "title" or key == "description":
                if not "$or" in search:
                    search["$or"] = []
                search["$or"].append(
                    {key: {"$regex": re.compile(str(body[key]), re.IGNORECASE)}})
            else:
                search[key] = {"$in": body[key]}
    search["availibility_end"] = {"$gte": datetime.now(pytz.utc)}
    search["available"] = True
    number_items = body["_pagination"]["items_per_page"]
    page_number = body["_pagination"]["page_number"]
    print(search)
    if ("_order" in body and len(body["_order"]) > 0):
        results = db_locsapp["articles"].find(search).sort(ordering)[
            ((page_number -
              1) *
             number_items): (
                (page_number -
                 1) *
                number_items) +
            number_items]
    else:
        results = db_locsapp["articles"].find(search)[
            ((page_number -
              1) *
             number_items): (
                (page_number -
                 1) *
                number_items) +
            number_items]
    document["metadatas"]["page_number"] = body[
        "_pagination"]["page_number"]
    number_pages = int(results.count() / number_items)
    document["metadatas"][
        "total_pages"] = 1 if number_pages < 1 else number_pages
    document["metadatas"]["total_items"] = results.count()
    for instance in results:
        document["articles"].append(APIrequests.parseObjectIdToStr(instance))
    return JsonResponse(document)


def demandsOptions(request, key_check, visibility, status, status_message):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf8'))
        print(body["id_demand"])
        if (body["id_demand"] is None):
            return JsonResponse(
                {"Error": "The key id_demand is needed."}, status=401)
        demand = db_locsapp["article_demands"].find_one(
            {"_id": ObjectId(body["id_demand"])})
        if (demand is None):
            return JsonResponse(
                {"Error": "The demand doesn't exist."}, status=401)
        if (demand[key_check] != request.user.pk):
            return JsonResponse(
                {"Error": "You are not allowed to do that."}, status=401)
        db_locsapp["article_demands"].update({"_id": ObjectId(body["id_demand"])}, {
                                             "$set": {"visible": visibility, "status": status}})
        return JsonResponse(
            {"message": status_message}, status=200)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def refuseDemand(request):
    return demandsOptions(request, "id_target", False, "refused",
                          "The demand has been successfully denied!")


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def retractDemand(request):
    return demandsOptions(request, "id_author", False, "retracted",
                          "You have successfully retracted!")


@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes((IsAuthenticated,))
def demandsMain(request):
    model = {
        "id_author": {
            "_type": int,
            "_default": request.user.pk,
            "_protected": True
        },
        "author_name": {
            "_type": str
        },
        "author_notation": {
            "_type": int,
            "_max": 5,
            "_min": -1
        },
        "id_target": {
            "_type": int
        },
        "name_target": {
            "_type": str
        },
        "id_article": {
            "_type": ObjectId()
        },
        "availibility_start": {
            "_type": str
        },
        "availibility_end": {
            "_type": str
        },
        "date_issued": {
            "_type": str,
            "_protected": True,
            "_default": datetime.now(pytz.utc)
        },
        "article_name": {
            "_type": str
        },
        "article_thumbnail_url": {
            "_type": str
        },
        "status": {
            "_type": str,
            "_default": "pending"
        },
        "visible": {
            "_type": bool,
            "_default": True
        }
    }

    if request.method == "POST":
        return APIrequests.POST(
            request, model, "article_demands", "The demand has been successfully issued!", verifyIfDemandAlreadyIssued)
    elif request.method == "GET":
        return APIrequests.GET(
            'article_demands', special_field={"id_target": request.user.pk, "visible": True, "status": "pending"})
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


"""
HISTORY
"""
@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getArticleHistoryAsClient(request, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        field = {"id_author": request.user.pk, "visible": True}
        nb_page, articles_as_client = paginationAPI(id_page, db_locsapp["article_demands"], field)
        return JsonResponse(
            {"nb_page": nb_page, "articles_as_client": articles_as_client})

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getArticleHistoryAsRenter(request, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        field = {"id_target": request.user.pk, "visible": True}
        nb_page, articles_as_renter = paginationAPI(id_page, db_locsapp["article_demands"], field)
        return JsonResponse(
            {"nb_page": nb_page, "articles_as_renter": articles_as_renter})

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getNotationsAsClient(request, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        try:
            user = get_user_model().objects.get(username=request.user.username)
            user_pk = user.pk
            nb_item = db_locsapp["notations"].count({"id_target": int(user_pk), "as_renter": False})
            item_on_a_page = 10
            nb_page = math.ceil(nb_item / item_on_a_page)
            notations_as_client = []

            if (id_page - 1) * 10 > nb_item:
                id_page = nb_page

            skip_page = id_page - 1
            if skip_page < 0:
                skip_page = 0
            for notation_as_client in db_locsapp["notations"].find({"id_target": int(user_pk), "as_renter": False}).sort("date_issued", DESCENDING).skip((skip_page) * item_on_a_page).limit(item_on_a_page):
                notation_as_client['_id'] = str(notation_as_client['_id'])
                notations_as_client.append(notation_as_client)

            return JsonResponse({"nb_page": nb_page, "notations_as_client": notations_as_client, "average_mark": user.tenant_score})

        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)

@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getNotationsAsRenter(request, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        # On get la target
        try:
            user = get_user_model().objects.get(username=request.user.username)
            user_pk = user.pk
            nb_item = db_locsapp["notations"].count({"id_target": int(user_pk), "as_renter": True})
            item_on_a_page = 10
            nb_page = math.ceil(nb_item / item_on_a_page)
            notations_as_renter = []

            if (id_page - 1) * 10 > nb_item:
                id_page = nb_page

            skip_page = id_page - 1
            if skip_page < 0:
                skip_page = 0

            for notation_as_renter in db_locsapp["notations"].find({"id_target": int(user_pk), "as_renter": True}).sort("date_issued", DESCENDING).skip((skip_page) * item_on_a_page).limit(item_on_a_page):
                notation_as_renter['_id'] = str(notation_as_renter['_id'])
                notations_as_renter.append(notation_as_renter)

            return JsonResponse({"nb_page": nb_page, "notations_as_renter": notations_as_renter, "average_mark": user.renter_score})
        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)

    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)
    """"
    if request.method == "GET":
        return APIrequests.GET(
            "notations", special_field={"id_target": request.user.pk, "as_renter": True})
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
    """

@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def acceptDemand(request):
    if request.method == "POST":
        if request.body:
            answer = json.loads(request.body.decode('utf8'))
            if not answer["id_demand"]:
                return JsonResponse(
                    {"Error": "You need to send the id of the demand."}, status=401)
            print(answer["id_demand"])
            document = db_locsapp["article_demands"].find_one(
                {"_id": ObjectId(answer['id_demand'])})
            if document is None:
                return JsonResponse(
                    {"Error": "The demand doesn't exist."}, status=401)
            if document["id_target"] != request.user.pk:
                return JsonResponse(
                    {"Error": "You're not allowed to accept this demand."}, status=401)
            if document["status"] != "pending":
                return JsonResponse(
                    {"Error": "This demand isn't a pending request."}, status=401)
            print(document)
            id_article = document["id_article"]
            db_locsapp["article_demands"].update(
                {
                    "id_target": request.user.pk, "id_article": id_article, "status": "pending"}, {
                    "$set": {
                        "status": "refused"}}, multi=True)
            db_locsapp["article_demands"].update({"_id": ObjectId(answer['id_demand'])}, {
                "$set": {"status": "accepted"}})
            db_locsapp["articles"].update({"_id": ObjectId(id_article)}, {
                                          "$set": {"available": False}})
            return JsonResponse(
                {"message": "Request has been successfully accepted!"})
        else:
            return JsonResponse({"Error": "Please send a json"}, status=404)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def demandsAsRenting(request):
    if request.method == "GET":
        return APIrequests.GET(
            'article_demands', special_field={"id_author": request.user.pk, "visible": True, "status": "pending"})
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def currentTimelines(request):
    if request.method == "GET":
        docs = APIrequests.GET(
            'article_demands', special_field={"id_target": request.user.pk, "visible": True, "status": "accepted"}, raw=True)
        for idx, document in enumerate(docs["article_demands"]):
            if (datetime.now(pytz.utc) > parse(document["availibility_end"])):
                db_locsapp["article_demands"].update({"_id": ObjectId(document['_id'])}, {
                                                     "$set": {"status": "finished"}})
                docs["article_demands"].pop(idx)
        return (HttpResponse(json.dumps(
                docs, sort_keys=True, indent=4, default=json_util.default)))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def currentTimelinesAsRenting(request):
    if request.method == "GET":
        docs = APIrequests.GET(
            'article_demands', special_field={"id_author": request.user.pk, "visible": True, "status": "accepted"}, raw=True)
        for idx, document in enumerate(docs["article_demands"]):
            if (datetime.now(pytz.utc) > parse(document["availibility_end"])):
                db_locsapp["article_demands"].update({"_id": ObjectId(document['_id'])}, {
                                                     "$set": {"status": "finished"}})
                docs["article_demands"].pop(idx)
        return (HttpResponse(json.dumps(
                docs, sort_keys=True, indent=4, default=json_util.default)))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


def verifyIfDemandAlreadyIssued(document):
    if (db_locsapp["article_demands"].find_one({"$and": [{"id_article": document["id_article"]}, {
            "id_author": document["id_author"]}, {"status": {"$ne": "retracted"}}]}) is not None):
        return ({"error": "You already made the demand for this article."})
    elif (db_locsapp["article_demands"].find_one({"id_article": document["id_article"], "id_target": document["id_author"]}) is not None):
        return ({"error": "You can't demand for your own article."})
    else:
        return (True)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def postNewMark(request):
    model = {
        "id_author": {
            "_type": int,
            "_default": request.user.pk,
            "_protected": True
        },
        "author_name": str,
        "id_target": int,
        "id_demand": {
            "_type": ObjectId()
        },
        "id_article": {
            "_type": ObjectId()
        },
        "article_name": str,
        "value": {
            "_type": int,
            "_min": 1,
            "_max": 5
        },
        "as_renter": {
            "_type": bool
        },
        "comment": {
            "_type": str,
            "_length": 90
        },
        "date_issued": {
            "_type": str,
            "_protected": True,
            "_default": datetime.now(pytz.utc)
        }
    }
    if request.method == "POST":
        return APIrequests.POST(
            request, model, "notations", "The mark has been successfully added!", verifyIfNotAlreadyIssued)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getMarkForClient(request, id_page):
    if request.method == "GET":
        docs = APIrequests.GET(
            'article_demands', special_field={"id_target": request.user.pk, "visible": True, "status": "finished"}, raw=True)
        for idx, document in enumerate(docs["article_demands"]):
            if (db_locsapp["notations"].find_one(
                    {"id_demand": document["_id"], "as_renter": False}) is not None):
                docs["article_demands"].pop(idx)
        return (HttpResponse(json.dumps(
                docs, sort_keys=True, indent=4, default=json_util.default)))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getMarkForRenter(request, id_page):
    if request.method == "GET":
        docs = APIrequests.GET(
            'article_demands', special_field={"id_author": request.user.pk, "visible": True, "status": "finished"}, raw=True)
        for idx, document in enumerate(docs["article_demands"]):
            if (db_locsapp["notations"].find_one(
                    {"id_demand": document["_id"], "as_renter": True}) is not None):
                docs["article_demands"].pop(idx)
        return (HttpResponse(json.dumps(
                docs, sort_keys=True, indent=4, default=json_util.default)))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


def verifyIfNotAlreadyIssued(document):
    print(document)
    if (db_locsapp["articles"].find_one(
            {"_id": ObjectId(document['id_article'])}) is None):
        return ({"Error": "The article doesn't exist."})
    retrieve = db_locsapp["article_demands"].find_one(
        {"_id": ObjectId(document['id_demand'])})
    if (retrieve is None or retrieve["id_article"] != document["id_article"]):
        return ({"Error": "id_demand not conform."})
    if (retrieve["status"] == "accepted"):
        if (datetime.now(pytz.utc) > parse(document["availibility_end"])):
            db_locsapp["article_demands"].update({"_id": ObjectId(document['id_demand'])}, {
                                                 "$set": {"status": "finished"}})
        else:
            return ({"Error": "The article renting is not finished yet."})
    elif (retrieve["status"] == "pending"):
        return ({"Error": "The demand hasn't even been accepted yet."})
    elif (retrieve["status"] == "completed"):
        return ({"Error": "The transaction has already been completed"})
    if ((document["as_renter"] is True and retrieve["id_author"] != document["id_author"]) or (
            document["as_renter"] is False and retrieve["id_target"] != document["id_author"])):
        return ({"Error": "You are not allowed to make this notation."})
    if (db_locsapp["marks"].find_one({"id_demand": document["id_demand"], "id_article": document[
            'id_article'], "id_target": document["id_target"], "id_author": document["id_author"]}) is not None):
        return ({"Error": "You already gave a mark for this article."})
    if (db_locsapp["notations"].find_one({"id_demand": document[
            "id_demand"], "as_renter": not document["as_renter"]}) is not None):
        db_locsapp["article_demands"].update({"_id": ObjectId(document['id_demand'])}, {
            "$set": {"status": "completed"}})
    try:
        User = get_user_model()
        current_user = User.objects.get(pk=document["id_target"])
        number_of_marks = db_locsapp["notations"].find(
            {"id_target": document["id_author"], "as_renter": document["as_renter"]}).count()
        if (number_of_marks != 0):
            if (document["as_renter"] is True):
                new_average = current_user.renter_score + (document["value"] -
                                                           current_user.renter_score) / number_of_marks
                current_user.renter_score = int(new_average)
            else:
                new_average = current_user.tenant_score + (document["value"] -
                                                           current_user.tenant_score) / number_of_marks
                current_user.tenant_score = int(new_average)
        else:
            new_average = document["value"]
            if (document["as_renter"] is True):
                current_user.renter_score = int(new_average)
            else:
                current_user.tenant_score = int(new_average)
        print("IN HERE")
        current_user.save()
    except:
        return ({"Error": "Error while updating the user model."})
    return (True)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def postNewArticle(request):
    model = {
        "title": {
            "_type": str,
            "_length": 50
        },
        "id_author": {
            "_type": int,
            "_default": request.user.pk,
            "_protected": True
        },
        "username_author": {
            "_type": str,
            "_default": request.user.username,
            "_protected": True
        },
        "url_thumbnail": {
            "_type": str,
            "_default": "media/articles/default.jpg",
            "_length": 100
        },
        "url_pictures": {
            "_type": [str],
            "_required": False
        },
        "comments": {
            "_type": [ObjectId()],
            "_required": False
        },
        "gender": ObjectId(),
        "base_category": ObjectId(),
        "sub_category": ObjectId(),
        "tags": {
            "_type": [ObjectId()],
            "_required": False
        },
        "size": ObjectId(),
        "payment_methods": [ObjectId()],
        "brand": ObjectId(),
        "clothe_condition": ObjectId(),
        "description": {
            "_type": str,
            "_default": "This article has no description",
            "_length": 5000
        },
        "availibility_start": {
            "_type": str,
            "_length": 50
        },
        "availibility_end": {
            "_type": str,
            "_length": 50
        },
        "creation_date": {
            "_type": str,
            "_protected": True,
            "_default": datetime.now(pytz.utc)
        },
        "modified_date": {
            "_type": str,
            "_required": False
        },
        "location": {
            "_type": ObjectId(),
            "_required": False
        },
        "price": {
            "_type": int,
            "_max": 500,
            "_min": 0
        },
        "color": ObjectId(),
        "demands": {
            "_type": [ObjectId()],
            "_required": False
        },
        "id_renter": {
            "_type": int,
            "_required": False
        },
        "available": {
            "_type": bool,
            "_default": True
        },
        "article_state": {
            "_type": ObjectId(),
            "_required": False
        }
    }

    if request.method == "POST":
        return APIrequests.POST(
            request, model, "articles", "The article has been successfully created!", convertDates)
        '''
        return APIrequests.forgeAPIrequestCreate(
            "POST", request, fields_definition, db_locsapp["articles"])
        '''
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


def convertDates(document):
    try:
        availibility_start = datetime.strptime(
            document["availibility_start"], "%d/%m/%Y")
        availibility_end = datetime.strptime(
            document["availibility_end"], "%d/%m/%Y")
        document["availibility_start"] = availibility_start
        document["availibility_end"] = availibility_end
    except:
        return({"error": "Misformatted availibility_start or availibility_end"})
    return (True)

# Updates an article


@csrf_exempt
def articleAlone(request, article_pk):
    model = {
        "title": {
            "_type": str,
            "_length": 50
        },
        "id_author": {
            "_type": int,
            "_protected": True
        },
        "url_thumbnail": {
            "_type": str,
            "_length": 100
        },
        "url_pictures": [str],
        "comments": [ObjectId()],
        "gender": ObjectId(),
        "base_category": ObjectId(),
        "sub_category": ObjectId(),
        "tags": [ObjectId()],
        "size": ObjectId(),
        "payment_methods": ObjectId(),
        "brand": ObjectId(),
        "clothe_condition": ObjectId(),
        "description": {
            "_type": str,
            "_default": "This article has no description",
            "_length": 5000
        },
        "availibility_start": {
            "_type": str,
            "_length": 50
        },
        "availibility_end": {
            "_type": str,
            "_length": 50
        },
        "creation_date": {
            "_type": str,
            "_protected": True
        },
        "modified_date": str,
        "location": ObjectId(),
        "price": {
            "_type": float,
            "_max": 500,
            "_min": 0
        },
        "color": ObjectId(),
        "demands": [ObjectId()],
        "id_renter": int,
        "article_state": ObjectId()
    }

    if request.method == "PUT":
        return APIrequests.PUT(
            request, model, "articles", "The article has been successfully modified!", article_pk)
    elif request.method == "GET":
        doc = db_locsapp["articles"].find_one({"_id": ObjectId(article_pk)})
        answer = APIrequests.parseObjectIdToStr(doc)
        return (JsonResponse(answer))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

""" Show article """


@csrf_exempt
def getArticle(request, article_pk):
    if request.method == "GET":
        # We also need to send the global mark of the user and the nb of notation as a renter
        article = db_locsapp["articles"].find_one({"_id": ObjectId(article_pk)})
        if article is None:
            return JsonResponse({"Error": "Article not found"}, status=404)
        article = APIrequests.parseObjectIdToStr(article)
        global_mark_as_renter = get_user_model().objects.get(pk=article["id_author"]).renter_score
        nb_mark_as_renter = db_locsapp["notations"].count({"id_target": int(article["id_author"]), "as_renter": True})

        is_in_favorite = False
        user = Utility.checkUserAuthenticated(request)
        if user is not False and db_locsapp["favorite_article"].find_one({"id_user": user.pk, "id_article": article_pk}):
            is_in_favorite = True

        is_reported = False
        if user is not False and db_locsapp['reports'].find_one({"id_author": user.pk, "id_article": article["_id"]}):
            is_reported = True

        """
        We look for article in the same:
         range of price + or - 10 euros
         same category
         and near same km range IMPORTANT
         same subcategory (maybe)
        """
        articles_recommend = []
        price_range = 1000
        #article_recommend_mongo = db_locsapp["articles"].find({"price": {"$gt": article["price"] - price_range, "$lt": article["price"] + price_range}}
        #                                                ).limit(10)
        # print("article recooment = ", article_recommend)
        """"
        for article_recommend in article_recommend_mongo:
            print("article = ", article_recommend)
            if article_recommend["_id"] != ObjectId(article_pk):
                article_recommend = APIrequests.parseObjectIdToStr(article_recommend)
                articles_recommend.append(article_recommend)
         """

        return JsonResponse({"article": article, "global_mark_as_renter": global_mark_as_renter,
                             "nb_mark_as_renter": nb_mark_as_renter, "is_in_favorite": is_in_favorite,
                             "is_reported": is_reported, "articles_recommend": articles_recommend})
        # return APIrequests.GET('articles', id=article_pk)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


# Route for show articles in user profile
@csrf_exempt
def getFirstFourArticleOwnedByUser(request, user_pk):
    if request.method == "GET":
        articles = []
        total_article = db_locsapp["articles"].count({"id_author": int(user_pk), "available": True})

        for article in db_locsapp["articles"].find({"id_author": int(user_pk), "available": True}).sort("creation_date", DESCENDING).limit(4):
            article['_id'] = str(article['_id'])
            articles.append(article)

        return JsonResponse({"nb_total_articles": total_article, "articles": articles})
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


# Route for show all all articles owend by an user
# We print 10 item by page
@csrf_exempt
def getAllArticleOwnedByUser(request, user_pk, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        nb_item = db_locsapp["articles"].count({"id_author": int(user_pk), "available": True})
        item_on_a_page = 10
        nb_page = nb_item / item_on_a_page
        articles = []

        # W
        if (id_page - 1) * 10 > nb_item:
            id_page = nb_page

        for article in db_locsapp["articles"].find({"id_author": int(user_pk), "available": True}).sort("creation_date", DESCENDING).skip((id_page - 1) * item_on_a_page).limit(item_on_a_page):
            article['_id'] = str(article['_id'])
            articles.append(article)

        return JsonResponse({"nb_page": nb_page, "articles": articles})
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)

"""
We send an email to the adminstrator that tell us who user send a report for which article
"""


@csrf_exempt
@api_view(['POST'])
def sendReport(request):
    if request.method == "POST":
        if request.body:
            answer = json.loads(request.body.decode('utf8'))
            print("answer = ", answer)

            if 'id_article' not in answer or 'id_report_type' not in answer or 'email' not in answer:
                return JsonResponse({"Error": "Your forget to add fields"}, status=405)
            if not ObjectId.is_valid(answer['id_article']) or not ObjectId.is_valid(answer['id_report_type']):
                return JsonResponse({"Error": "Please add a correct Object id fields"}, status=405)

            article = db_locsapp["articles"].find_one({"_id": ObjectId(answer["id_article"])})
            report_type = db_locsapp["report_types"].find_one({"_id": ObjectId(answer["id_report_type"])})

            if article is None or report_type is None:
                return JsonResponse({"Error": "Add an existing article and report_type"}, status=405)

            current_user_pk = -1
            current_user_username = "anonymous"
            current_user = Utility.checkUserAuthenticated(request)
            if current_user is not False:
                current_user_pk = current_user.pk
                current_user_username = current_user.username

            if article["id_author"] == current_user_pk and current_user_pk != -1:
                return JsonResponse({"Error": "You are the owner of this article"}, status=403)

            model = {
                "id_article": {
                    "_type": ObjectId(),
                    "_required": True
                },

                "id_owner_article": {
                    "_type": int,
                    "_protected": True,
                    "_default": article['id_author']
                },
                "username_owner_article": {
                    "_type": str,
                    "_protected": True,
                    "_default": article['username_author']
                },

                "id_report_type": {
                  "_type": ObjectId(),
                },

                "report_type_str": {
                    "_type": str,
                    "_default": report_type['name']
                },

                "id_author": {
                    "_type": int,
                    "_protected": True,
                    "_default": current_user_pk
                },
                "username_author": {
                    "_type": str,
                    "_protected": True,
                    "_default": current_user_username
                },
                "email": {
                    "_type": str,
                    "_length": 50
                },
                "first_name": {
                    "_type": str,
                    "_length": 50,
                },
                "last_name": {
                    "_type": str,
                    "_length": 50
                },
                "message": {
                    "_type": str,
                    "_length": 1000,
                    "_required": False
                },
                "creation_date": {
                    "_type": str,
                    "_protected": True,
                    "_default": datetime.now(pytz.utc)
                },

            }

            if current_user_pk == -1:
                report = db_locsapp['reports'].find_one({"email": answer['email'], "id_article": answer['id_article']})
            else:
                    report = db_locsapp['reports'].find_one({"id_author": current_user_pk, "id_article": answer['id_article']})
            if report:
                return JsonResponse({"Error": "Your already reported this article"}, status=405)
            else:
                return APIrequests.POST(
                    request, model, "reports", "The report has been successfully sent!")

            """
            message = 'The user ' + request.user.username + ' sent a report about this article' + \
                ' <a href="' + settings.URL_FRONT + 'article/' + str(article['_id']) + '">' + \
                article['title'] + '</a>'
            email = EmailMessage('Report for article ' + article['title'], message,
                                 to=list_email)
            email.send()
            """
            return JsonResponse(
                {"Success": "Report sent to the administrators."}, status=200)
        else:
            return JsonResponse({"Error": "Please send a json"}, status=404)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
