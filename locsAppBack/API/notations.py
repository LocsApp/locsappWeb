import math
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from pymongo import MongoClient, ASCENDING, DESCENDING
from .APIrequest import paginationAPI

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('mongo', 27017)
db_locsapp = mongodb_client['locsapp']

# Route for show articles in user profile
@csrf_exempt
def getFirstFourNotationOwnedByUser(request, user_pk):
    if request.method == "GET":
        notations_as_renter = []
        notations_as_client = []

        total_notation_as_renter = db_locsapp["notations"].count({"id_target": int(user_pk), "as_renter": True})
        total_notation_as_client = db_locsapp["notations"].count({"id_target": int(user_pk), "as_renter": False})

        for notation_as_renter in db_locsapp["notations"].find({"id_target": int(user_pk), "as_renter": True}).sort("date_issued", DESCENDING).limit(2):
            notation_as_renter['_id'] = str(notation_as_renter['_id'])
            notations_as_renter.append(notation_as_renter)

        for notation_as_client in db_locsapp["notations"].find({"id_target": int(user_pk), "as_renter": False}).sort("date_issued", DESCENDING).limit(2):
            notation_as_client['_id'] = str(notation_as_client['_id'])
            notations_as_client.append(notation_as_client)

        return JsonResponse({"nb_notation_renter": total_notation_as_renter, "renter_notation": notations_as_renter,
                             "nb_notation_client": total_notation_as_client, "client_notation": notations_as_client})
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


@csrf_exempt
def getAllNotationAsClientByUser(request, username, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        try:
            user = get_user_model().objects.get(username=username)
            field = {"id_target": int(user.pk), "as_renter": False}
            nb_page, notations_as_client = paginationAPI(id_page, db_locsapp["notations"], field)
            return JsonResponse({"nb_page": nb_page, "notations_as_client": notations_as_client, "average_mark": user.tenant_score})

        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


@csrf_exempt
def getAllNotationAsRentertByUser(request, username, id_page):
    if request.method == "GET":
        id_page = int(id_page)
        # On get la target
        try:
            user = get_user_model().objects.get(username=username)
            field = {"id_target": int(user.pk), "as_renter": True}
            nb_page, notations_as_renter = paginationAPI(id_page, db_locsapp["notations"], field)
            return JsonResponse({"nb_page": nb_page, "notations_as_renter": notations_as_renter, "average_mark": user.renter_score})
        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)

    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


"""
We send an email to the adminstrator that tell us who user send a report for which article
"""
