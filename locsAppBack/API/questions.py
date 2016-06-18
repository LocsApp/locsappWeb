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
		return APIrequests.GET("questions", special_field={"id_author": request.user.pk, "visible": True})

	elif request.method == "POST":

		body = json.loads(request.body.decode('utf8'))
		if not ObjectId.is_valid(body['id_article']):
			return JsonResponse(
				{"Error": "Please send a correct article id"}, status=401)

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
					"_type": str
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
	id_article = document['id_article']
	print("document = ", document)
	document.pop("image_article")
	document.pop("title_article")
	document.pop("id_article")
	try:
		questions = article['questions']
		questions.append(document)
		db_locsapp["articles"].update({"_id": ObjectId(id_article)}, {
			"$set": {"questions": questions}})
	except KeyError:
		db_locsapp["articles"].update({"_id": ObjectId(id_article)}, {
			"$set": {"questions": [document]}})

	return True

