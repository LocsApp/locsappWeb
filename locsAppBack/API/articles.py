from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .views import db_locsapp
from .views import APIrequests
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from bson import ObjectId
from bson import Binary, Code
from bson.json_util import dumps
from bson import json_util
from django.http import HttpResponse


import json
from bson import ObjectId

from types import *

import pytz
from datetime import datetime


""" Articles """

# Creates a new article


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
            "_default": "http://default.png/",
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
            "_protected": True,
            "_default": datetime.now(pytz.utc)
        },
        "modified_date": {
            "_type": str,
            "_required": False
        },
        "location": ObjectId(),
        "price": {
            "_type": float,
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
            "_type": ObjectId()
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
    fields_definition_put = \
        {"name": "text, 30",
         "tiny_logo_url": "text, 255",
         "big_logo_url": "text, 255",
         "description": "text, 500",
         "id_author": "integer",
         "date_created": "date",
         "id_type": "id",
         "comments": "array",
         "pictures": "array",
         "informations": "dict"}

    if (request.method == "PUT"):
        return APIrequests.forgeAPIrequestPut(
            request, article_pk, fields_definition_put, db_locsapp["articles"])
    else:
        return (JsonResponse({"Error": "Method not allowed!"}, status=405))


@csrf_exempt
def getArticle(request, article_pk):
    if request.method == "GET":
        article = db_locsapp["articles"].find_one(
            {"_id": ObjectId(article_pk)})
        return HttpResponse(json.dumps(
            article, sort_keys=True, indent=4, default=json_util.default))
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
