import json
from bson import ObjectId
from django.http import JsonResponse
from pymongo import MongoClient
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .views import APIrequests
from datetime import datetime
import pytz
from .APIrequest import paginationAPI

# Connects to the db and creates a MongoClient instance
mongodb_client = MongoClient('mongo', 27017)
db_locsapp = mongodb_client['locsapp']


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def sendQuestion(request):
    """
    On s occupe que du document question d abord
    On doit creer une liste de questions et on append si une question associe au meme id article
    existe
    """

    if request.method == "POST":

        body = json.loads(request.body.decode('utf8'))
        print("ceci est une phrase")
        #print(body['content'])

        if 'thumbs_up' in body or 'report' in body or 'id_author' in body or 'title' in body or \
                        'url_thumbnail' in body:
            return JsonResponse(
                {"Error": "Some of this field(s) are protected"}, status=401)
        if not ObjectId.is_valid(body['id_article']):
            return JsonResponse(
                {"Error": "Please send a correct article id"}, status=401)
        if 'id_author' in body or 'url_thumbnail' in body or 'title' in body:
            return JsonResponse(
                {"Error": "What are you trying to do ?"}, status=401)

        article = db_locsapp["articles"].find_one(
            {"_id": ObjectId(body['id_article'])})

        if request.user.pk == article['id_author']:
            return JsonResponse({"Error": "You are the owner of this article"}, status=401)

        if article:
            print("body = ", body)
            id_question = ObjectId()
            #print(body['content'])

            # print("ARTICLE = ", article)
            model = {

                "content": {
                    "_type": str
                },

                "id": {
                    "_type": str,
                    "_default": str(id_question),
                    "_protected": True
                },

                "id_author": {
                    "_type": int,
                    "_default": request.user.pk,
                    "_protected": True
                },
                "author_name": {
                    "_type": str,
                    "_default": request.user.username,
                    '_protected': True
                },

                "id_owner_article": {
                    "_type": int,
                    "_default": article['id_author']
                },

                "thumbs_up": {
                    "_type": [int],
                    "_default": [],
                    # "_protected": True
                },
                "report": {
                    "_type": [int],
                    "_default": [],
                    # "_protected": True
                },
                "visible": {
                    "_type": bool,
                    "_default": True
                },
                "response": {
                    "_type": str,
                    "_default": None
                },
                "id_article": {
                    "_type": ObjectId(),
                    "_default": article['_id']
                },
                "title_article": {
                    "_type": str,
                    "_default": article['title']
                },
                "image_article": {
                    "_type": str,
                    "_default": article['url_thumbnail']
                },
                "creation_date": {
                    "_type": str,
                    "_protected": True,
                    "_default": datetime.now(pytz.utc)
                },
                # Check title article and image article exsits
            }
            # Send the result of the get after updating the model
            if APIrequests.POST(request, model, "questions", "The question has been sent!",
                                    addQuestionInArticle):
                return APIrequests.GET("questions", special_field={"id": str(id_question)})
            else:
                return JsonResponse("Error:" "problem when updating the document")
        else:
            return JsonResponse({"Error": "We need a valid id article"}, status=403)

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


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def answerQuestion(request):
    if request.method == 'POST':

        body = json.loads(request.body.decode('utf8'))

        if 'id_question' not in body or 'response' not in body:
            return JsonResponse({"Error": "You are missing some fields!"}, status=405)

        question = db_locsapp["questions"].find_one({"id": body['id_question']})

        if question is None:
            return JsonResponse({"Error": "Enter a valid question id!"}, status=404)
        if request.user.pk != question['id_owner_article']:
            return JsonResponse({"Error": "You are not the owner of the article!"}, status=403)

        # We update the question in the document question
        # question = db_locsapp["questions"].find_one({"id": body['id_question']})
        print("question = ", question)
        db_locsapp["questions"].update_one({"id": body['id_question']}, {"$set": {"response":
                                                                                      body[
                                                                                          'response']}})
        # We find the aricle with this question
        articles = db_locsapp["articles"].find({"questions.id": body['id_question']})
        article = None

        for articleLoop in articles:
            article = articleLoop

        # We change the answer in the question
        questions = article['questions']
        i = 0
        for question in questions:
            if question['id'] == body['id_question']:
                questions[i]['response'] = body['response']
            i += 1

        db_locsapp["articles"].update_one({"_id": article['_id']},
                                          {"$set": {"questions": questions}})
        # print("articleEEEEEE  =", article)

        return JsonResponse({"Success": "Answer has been sent!"}, status=201)

    # On update la question dans l articke
    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def thumbsUp(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf8'))

        if 'id_question' not in body:
            return JsonResponse({"Error": "You are missing some fields!"}, status=405)

        question = db_locsapp["questions"].find_one({"id": body['id_question']})
        if question is None:
            return JsonResponse({"Error": "Enter a valid question id!"}, status=404)
        if request.user.pk == question['id_author']:
            return JsonResponse({"Error": "You are the person who asked the question!"}, status=403)
        if request.user.pk in question['thumbs_up']:
            return JsonResponse({"Error": "You already up vote this question!"}, status=403)

        # Update the question document
        question['thumbs_up'].append(request.user.pk)
        db_locsapp["questions"].update_one({"id": body['id_question']}, {"$set": {"thumbs_up":
                                                                                      question[
                                                                                          'thumbs_up']}})

        # We find the aricle with this question
        articles = db_locsapp["articles"].find({"questions.id": body['id_question']})
        article = None

        for articleLoop in articles:
            article = articleLoop

        # We change the answer in the question
        questions = article['questions']
        i = 0
        for question in questions:
            if question['id'] == body['id_question']:
                questions[i]['thumbs_up'].append(request.user.pk)
            i += 1

        db_locsapp["articles"].update_one({"_id": article['_id']},
                                          {"$set": {"questions": questions}})
        return JsonResponse({"Success": "Your upvote has been added!"}, status=201)

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def report(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf8'))

        if 'id_question' not in body:
            return JsonResponse({"Error": "You are missing some fields!"}, status=405)

        question = db_locsapp["questions"].find_one({"id": body['id_question']})
        if question is None:
            return JsonResponse({"Error": "Enter a valid question id!"}, status=404)
        if request.user.pk == question['id_author']:
            return JsonResponse({"Error": "You are the person who asked the question!"}, status=403)
        if request.user.pk in question['report']:
            return JsonResponse({"Error": "You already report this question!"}, status=403)

        # Update the question document
        question['report'].append(request.user.pk)
        db_locsapp["questions"].update_one({"id": body['id_question']}, {"$set": {"report":
                                                                                      question[
                                                                                          'report']}})

        # We find the aricle with this question
        articles = db_locsapp["articles"].find({"questions.id": body['id_question']})
        article = None

        for articleLoop in articles:
            article = articleLoop

        # We change the answer in the question
        questions = article['questions']
        i = 0
        for question in questions:
            if question['id'] == body['id_question']:
                questions[i]['report'].append(request.user.pk)
            i += 1

        db_locsapp["articles"].update_one({"_id": article['_id']},
                                          {"$set": {"questions": questions}})
        return JsonResponse({"Success": "Your report has been added!"}, status=201)

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def articleWithQuestionToAnswer(request, id_page=1):
    if request.method == "GET":
        id_page = int(id_page)
        field = {"id_author": request.user.pk, "questions.response": None}
        nb_page, questions_to_answer = paginationAPI(id_page, db_locsapp["articles"], field)
        return JsonResponse(
            {"nb_page": nb_page, "articles": questions_to_answer})

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)


@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def articleWithQuestionUserAsked(request, id_page=1):
    if request.method == "GET":
        id_page = int(id_page)
        field = {"questions.author_name": request.user.username, "questions.response": None}
        nb_page, questions_user_asked = paginationAPI(id_page, db_locsapp["articles"], field)
        return JsonResponse(
            {"nb_page": nb_page, "articles": questions_user_asked})

    else:
        return JsonResponse({"Error": "Method not allowed!"}, status=405)
