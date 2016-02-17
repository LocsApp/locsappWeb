from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .views import db_locsapp
from .views import APIrequests
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes


import json
from bson import ObjectId


""" Articles """

# Creates a new article


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def postNewArticle(request):
    print("User = ", type(request.user.pk))
    fields_definition = \
        {"name": "text, 30",
         "tiny_logo_url": "text, 255 | http://127.0.0.1:8000/media/pictures/tiny_pictures/articles/dummy.png",
         "big_logo_url": "text, 255 | http://127.0.0.1:8000/media/pictures/big_pictures/articles/dummy.png",
         "description": "text, 500",
         "id_author": "integer_protected | " + str(request.user.pk),
         "date_created": "date_default",
         "id_type": "id",
         "comments": "array",
         "pictures": "array",
         "informations": "dict"}

    if request.method == "POST":
        return APIrequests.forgeAPIrequestCreate(
            "POST", request, fields_definition, db_locsapp["articles"])
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
