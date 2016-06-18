"""
View for sending a question and notification to the owner
"""
import json
from bson import ObjectId
from django.http import JsonResponse
from pymongo import MongoClient

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .views import APIrequests

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('localhost', 27017)
db_locsapp = mongodb_client['locsapp']

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes((IsAuthenticated,))
def sendQuestion(request):
	"""
	On s occupe que du document question d abord
	On doit creer une liste de questions et on append si une question associe au meme id article
	existe
	"""

	if request.method == "GET":
		request.user.pk = 26
		questions = db_locsapp["questions"].find_one({"id_author": request.user.pk})
		print("Before print questions")
		print("questions = ", questions)
		return APIrequests.GET("questions", special_field={"id_author": request.user.pk, "visible": True})

	elif request.method == "POST":

		body = json.loads(request.body.decode('utf8'))
		if not ObjectId.is_valid(body['id_article']):
			return JsonResponse(
				{"Error": "Please send a correct article id"}, status=401)
		if 'id_author' in body or 'url_thumbnail' in body or 'title' in body:
			return JsonResponse(
				{"Error": "What are you trying to do ?"}, status=401)

		article = db_locsapp["articles"].find_one(
			{"_id": ObjectId(body['id_article'])})
		if article:
			# print("ARTICLE = ", article)

			model = {
				"id_author": {
					"_type": int,
					"_default": request.user.pk,
					"_protected": True
				},
				"author_name": {
					"_type": str,
					"_default": request.user.username,
				},

				"id_owner": {
					"_type": int,
					"_default": article['id_author']
				},


				"content": {
					"_type": str,
				},
				"thumbs_up": {
					"_type": int,
					"_default": 0,
					# "_protected": True
				},
				"report": {
					"_type": int,
					"_default": 0,
					# "_protected": True
				},
				"visible": {
					"_type": bool,
					"_default": True
				},
				"response": {
					"_type": ObjectId(),
					"_default": None
				},
				"id_article": {
					"_type": ObjectId()
				},
				"title_article": {
					"_type": str,
					"_default": article['title']
				},
				"image_article": {
					"_type": str,
					"_default": article['url_thumbnail']
				}
				# Check title article and image article exsits
			}

			return APIrequests.POST(
				request, model, "questions", "The question has been sent!", addQuestionInArticle)
		else:
			return JsonResponse({"Error": "We need a valid id article"}, status=405)

	else:
		return JsonResponse({"Error": "Method not allowed!"}, status=405)


def addQuestionInArticle(document):
	article = db_locsapp["articles"].find_one({"_id": ObjectId(document['id_article'])})
	# print("article = ", article)
	document_to_copy = document.copy()
	id_article = document['id_article']
	document_to_copy.pop("image_article")
	document_to_copy.pop("title_article")
	document_to_copy.pop("id_article")
	document_to_copy.pop('id_author')
	try:
		questions = article['questions']
		questions.append(document_to_copy)
		db_locsapp["articles"].update({"_id": ObjectId(id_article)}, {
			"$set": {"questions": questions}})
	except KeyError:
		db_locsapp["articles"].update({"_id": ObjectId(id_article)}, {
			"$set": {"questions": [document_to_copy]}})

	return True



