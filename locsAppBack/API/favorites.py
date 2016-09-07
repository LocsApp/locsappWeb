import json
from bson import ObjectId
from django.http import JsonResponse
from pymongo import MongoClient
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .views import APIrequests
from django.contrib.auth import get_user_model
from datetime import datetime
import pytz
import math
from pymongo import ASCENDING, DESCENDING


# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']



@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def deleteFavoriteArticle(request):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf8'))
        print("body = ", body)
        if 'id_favorite_article' not in body:
            return JsonResponse({"Error": "Please add the favorite article id"}, status=400)
        # We get the article from the db
        if not ObjectId.is_valid(body['id_favorite_article']):
            return JsonResponse(
                {"Error": "Please send a correct favorite article id"}, status=400)

        # We get the article from the db

        favorite_article = db_locsapp["favorite_article"].find_one({"id_article": body[
                                                                                   'id_favorite_article'], "id_user": request.user.pk})
        if favorite_article:
            db_locsapp["favorite_article"].delete_one({'_id': ObjectId(favorite_article[
                                                                           '_id'])})

            return JsonResponse({"Success": "This article has been removed from your favorite"},
                                 status=200)
        else:
            return JsonResponse({"Error": "Choose an article you have in favorite"}, status=403)


@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes((IsAuthenticated,))
def addFavoriteArticle(request):
    if request.method == "POST":
        # On a besoin de l'id Article et de l user connect (request.user)

        body = json.loads(request.body.decode('utf8'))
        print("body = ", body)
        print(body['id_article'])
        if 'id_article' not in body:
            return JsonResponse({"Error": "Please add the article id"}, status=400)
        # We get the article from the db
        if not ObjectId.is_valid(body['id_article']):
            return JsonResponse(
                {"Error": "Please send a correct article id"}, status=400)

        # We get the article from the db

        article = db_locsapp["articles"].find_one({"_id": ObjectId(body['id_article'])})
        if article["id_author"] == request.user.pk:
            return JsonResponse({"Error": "You are the owner of this article"}, status=403)
        if article:

            model = {

                "id_article": {
                    "_type": ObjectId(),
                    "_default": article['_id'],
                },

                "title": {
                    "_type": str,
                    "_default": article['title'],
                },

                'description': {
                    "_type": str,
                    "_default": article['description'],
                },

                'url_thumbnail': {
                    "_type": str,
                    "_default": article['url_thumbnail'],
                },

                'price': {
                    "_type": str,
                    "_default": article['price']
                },

                'id_user': {
                    "_type": int,
                    "_default": request.user.pk,
                    "_protected": True
                },
                "creation_date": {
                    "_type": str,
                    "_protected": True,
                    "_default": datetime.now(pytz.utc)
                },

            }

            if db_locsapp['favorite_article'].find_one({"id_article": body['id_article'],
                                                        "id_user": request.user.pk}):
                return JsonResponse({"Error": "This article is already in your favorite"}, status=403)

            return APIrequests.POST(request, model, "favorite_article",
                                    "This article has been added to your favorite")
        else:
            return JsonResponse({"Error": "We need a valid id article"}, status=403)

    elif request.method == 'GET':

        return APIrequests.GET("favorite_article",
                               special_field={"id_user": request.user.pk})

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)

@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def getFavoriteArticle(request, id_page):
    item_in_a_page = 10
    id_page = int(id_page)
    nb_item = db_locsapp["favorite_article"].count({"id_user": request.user.pk})
    nb_page = math.ceil(nb_item / item_in_a_page)
    favorites_articles = []

    if (id_page - 1) * item_in_a_page > nb_item:
        id_page = nb_page

    skip_page = id_page - 1
    if skip_page > 0:
        skip_page = 0

    for favorite_article in db_locsapp["favorite_article"].find(
            {"id_user": request.user.pk}).sort("creation_date", DESCENDING).skip(
                (skip_page) * item_in_a_page).limit(item_in_a_page):
        favorite_article['_id'] = str(favorite_article['_id'])
        favorites_articles.append(favorite_article)

    return JsonResponse(
        {"nb_page": nb_page, "favorite_article": favorites_articles})

    #return APIrequests.GET("favorite_article",
    #                       special_field={"id_user": request.user.pk})


@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes((IsAuthenticated,))
def addFavoriteResearch(request):
    if request.method == "GET":
        model = {
            "_type"
        }
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)