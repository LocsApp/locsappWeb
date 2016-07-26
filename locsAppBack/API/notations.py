import math
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from pymongo import MongoClient, ASCENDING, DESCENDING

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
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
def getAllNotationAsClientByUser(request, user_pk, id_page):
    if request.method == "GET":
        id_page = int(id_page)
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

        return JsonResponse({"nb_page": nb_page, "notation_as_client": notations_as_client})
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


@csrf_exempt
def getAllNotationAsRentertByUser(request, user_pk, id_page):
    if request.method == "GET":
        id_page = int(id_page)
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

        return JsonResponse({"nb_page": nb_page, "notation_as_client": notations_as_renter})
    else:
        return JsonResponse({"Error": "Method not allowed"}, status=405)


"""
We send an email to the adminstrator that tell us who user send a report for which article
"""
