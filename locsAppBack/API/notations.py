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
def getAllNotationTypeOwnedByUser(request, user_pk, id_page):
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
