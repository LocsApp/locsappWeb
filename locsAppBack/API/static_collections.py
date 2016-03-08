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


@csrf_exempt
def staticBaseCategories(request):
    if request.method == "GET":
        return APIrequests.GET("base_categories")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticSubCategories(request):
    if request.method == "GET":
        return APIrequests.GET("sub_categories")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticGenders(request):
    if request.method == "GET":
        return APIrequests.GET("genders")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticSizes(request):
    if request.method == "GET":
        return APIrequests.GET("sizes")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticClotheColors(request):
    if request.method == "GET":
        return APIrequests.GET("clothe_colors")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticClotheStates(request):
    if request.method == "GET":
        return APIrequests.GET("clothe_states")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
def staticPaymentMethods(request):
    if request.method == "GET":
        return APIrequests.GET("payment_methods")
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
