from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .views import db_locsapp
from .views import APIrequests
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.conf import settings


import json
from bson import ObjectId

import pytz
from datetime import datetime
import re


from pymongo import MongoClient

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
    number_items = body["_pagination"]["items_per_page"]
    page_number = body["_pagination"]["page_number"]
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
        print(search)
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


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def refuseDemand(request):
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
        if (demand["id_target"] != request.user.pk):
            return JsonResponse(
                {"Error": "You are not allowed to refuse this demand."}, status=401)
        db_locsapp["article_demands"].update({"_id": ObjectId(body["id_demand"])}, {
                                             "$set": {"visible": False}})
        return JsonResponse(
            {"message": "The demand has been successfully denied!"}, status=200)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


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
            'article_demands', special_field={"id_target": request.user.pk, "visible": True})
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


def verifyIfDemandAlreadyIssued(document):
    if (db_locsapp["article_demands"].find_one(
            {"id_article": document["id_article"], "id_author": document["id_author"]}) is not None):
        return ({"error": "You already made the demand for this article."})
    elif (db_locsapp["article_demands"].find_one({"id_target": document["id_author"]}) is not None):
        return ({"error": "You can't demand for your own article."})
    else:
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
        "article_state": {
            "_type": ObjectId(),
            "_required": False
        }
    }

    if request.method == "POST":
        return APIrequests.POST(
            request, model, "articles", "The article has been successfully created!")
        '''
        return APIrequests.forgeAPIrequestCreate(
            "POST", request, fields_definition, db_locsapp["articles"])
        '''
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

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
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

""" Show article """


@csrf_exempt
def getArticle(request, article_pk):
    if request.method == "GET":
        return APIrequests.GET('articles', id=article_pk)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


"""
We send an email to the adminstrator that tell us who user send a report for which article
"""


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def sendReport(request):
    if request.method == "POST":
        if request.body:
            answer = json.loads(request.body.decode('utf8'))
            print("Object id = ", answer)
            try:
                answer['article_id']
            except KeyError:
                return JsonResponse(
                    {"Error": "Please send the article id"}, status=404)

            if not ObjectId.is_valid(answer['article_id']):
                return JsonResponse(
                    {"Error": "Please send a correct article id"}, status=401)
            list_reporter = get_user_model().objects.filter(is_admin=True)
            list_email = ['locsapp.eip@gmail.com']
            for reporter in list_reporter:
                list_email.append(reporter.email)
            article = db_locsapp["articles"].find_one(
                {"_id": ObjectId(answer['article_id'])})
            if article is None:
                return JsonResponse(
                    {"Error": "This article does not exist"}, status=404)

            # We insert a new report in this article and if there is more than 5 users we create a
            #  new collection report associated to the id of this article

            message = 'The user ' + request.user.username + ' sent a report about this article' + \
                      ' <a href="' + settings.URL_FRONT + 'article/' + str(article['_id']) + '">' + \
                      article['title'] + '</a>'
            email = EmailMessage('Report for article ' + article['title'], message,
                                 to=list_email)
            email.send()
            return JsonResponse(
                {"Success": "Report sent to the administrators."}, status=200)
        else:
            return JsonResponse({"Error": "Please send a json"}, status=404)
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
