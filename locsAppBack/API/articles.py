from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .views import db_locsapp
from .views import APIrequests

import json
from bson import ObjectId


""" Articles """

# Creates a new article


@csrf_exempt
def postNewArticle(request):
    fields_definition = \
        {"name": "text, 30",
         "tiny_logo_url": "text, 255 | http://kek.fr/",
         "big_logo_url": "text, 255",
         "description": "text, 500",
         "id_author": "integer",
         "date_created": "date_default",
         "id_type": "integer"}

    return APIrequests.forgeAPIrequestCreate(
        "POST", request, fields_definition, db_locsapp["articles"])
