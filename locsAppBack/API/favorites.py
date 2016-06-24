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


# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']


@csrf_exempt
@api_view(['POST', 'DELETE'])
@permission_classes((IsAuthenticated,))
def addFavoriteArticle(request):
	if request.method == "POST":
		# On a besoin de l'id Article et de l user connect (request.user)

		body = json.loads(request.body.decode('utf8'))
		if 'id_article' not in body:
			return JsonResponse({"Error": "Please add the article id"}, status=400)
		# We get the article from the db
		if not ObjectId.is_valid(body['id_article']):
			return JsonResponse(
				{"Error": "Please send a correct article id"}, status=401)

		# We get the article from the db

		article = db_locsapp["articles"].find_one({"_id": ObjectId(body['id_article'])})
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
			return APIrequests.POST(request, model, "favorite_article",
			                        "This article has been added to your favorite",
			                        addFavoriteArticleInUserProfile)
		else:
			return JsonResponse({"Error": "We need a valid id article"}, status=403)

	elif request.method == "DELETE":
		body = json.loads(request.body.decode('utf8'))
		if 'id_favorite_article' not in body:
			return JsonResponse({"Error": "Please add the favorite article id"}, status=400)
		# We get the article from the db
		if not ObjectId.is_valid(body['id_favorite_article']):
			return JsonResponse(
				{"Error": "Please send a correct favorite article id"}, status=401)

		# We get the article from the db

		favorite_article = db_locsapp["favorite_article"].find_one({"_id": ObjectId(body[
			                                                                       'id_article']), "id_user": request.user.pk})
		if favorite_article:
			db_locsapp["favorite_article"].delete_one({'_id': ObjectId(favorite_article[
				                                                           '_id'])})

			user = get_user_model().object.get(pk=request.user.pk)
			favorite_article = user.favorite_articles
			favorite_article.remove(favorite_article['id'])
			return  JsonResponse({"Success": "This article has been removed from your favorite"},
			                     status=200)
		else:
			return JsonResponse({"Error": "Choose an article you have in favorite"}, status=403)
	else:
		return JsonResponse({"Error": "Method not allowed!"}, status=405)




def addFavoriteArticleInUserProfile(document):
	user = get_user_model().object.get(pk=document['id_user'])
	favorite_article = user.favorite_articles
	if favorite_article == None:
		favorite_article = [document['id_article']]
	else:
		if document['id_article'] not in favorite_article:
			favorite_article.append(document['id_article'])
		else:
			return {"error": "You already add this article in your favorite."}

	user.favorite_articles = favorite_article
	user.save()
	return True


