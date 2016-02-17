# Django imports
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# JSON import
import json
import bson

# Pymongo imports
from pymongo import MongoClient
from bson.objectid import ObjectId

import pytz
from datetime import datetime


class APIRequestMongo:

    """
    verifies is the fields are correct:
    text, <number> : verify if the text is small enough
    integer : verify that it is an integer,
    boolean : verify that it is a boolean,
    array : verifies if it is an array,
    dict : verifies if it is a dict,
    id : verifies if it is a mongo id,
    date_default: adds a default timezone date (today's date)
    integer_protected: integer protected and only can be affected by default value

    Feeds the default arguments (indicated by "|")
    """

    def parseObjectIdToStr(self, dictionary):
        if dictionary is None:
            return None
        for key in dictionary:
            if isinstance(dictionary[key], ObjectId):
                dictionary[key] = str(dictionary[key])
        return dictionary

    def verifyErrorsInFields(self, fields, answer, creation=True):
        error_fields = {}
        for key in fields:
            fields[key] = fields[key].replace(" ", "")
            temp_options = fields[key].split("|")[0].split(",")
            # Verification of protected values
            if (temp_options[0] == "integer_protected"):
                if key in answer:
                    error_fields[key] = "This field is protected"
            # Parsing of default values
            if (len(fields[key].split("|")) ==
                    2 and key not in answer and creation is True):
                if (temp_options[0] == "integer"):
                    answer[key] = int(fields[key].split("|")[1])
                else:
                    answer[key] = fields[key].split("|")[1]
            # Verification of input values
            if temp_options[0] == "text":
                if not isinstance(answer[key], type("kek")):
                    error_fields[key] = "It must be a string"
                elif (len(answer[key]) > int(temp_options[1])
                        or len(answer[key]) <= 0):
                    error_fields[
                        key] = "The text must not be empty and the length must be inferior or equal to" + temp_options[1]
            elif (temp_options[0] == "integer"):
                if (not isinstance(answer[key], type(1))):
                    error_fields[key] = "The field must be an integer"
            elif (temp_options[0] == "boolean"):
                if (not isinstance(answer[key], type(True))):
                    error_fields[key] = "The field must be a boolean"
            elif (temp_options[0] == "date_default"):
                answer[key] = datetime.now(pytz.utc)
            elif (temp_options[0] == "array"):
                if (not isinstance(answer[key], type([]))):
                    error_fields[key] = "The field must be a list"
            elif (temp_options[0] == "dict"):
                if (not isinstance(answer[key], type({}))):
                    error_fields[key] = "The field must be a dictionnary"
            elif (temp_options[0] == "id"):
                if (bson.objectid.ObjectId.is_valid(answer[key]) == False):
                    error_fields[key] = "The field must be a MongoDB ID"

            temp_options = []
        return (error_fields)

    # creates a Create API POST
    def forgeAPIrequestCreate(self, method, request, fields, collection):
        if request.method == "POST":
            if request.body:
                answer = json.loads(request.body.decode('utf8'))
                error_keys = {}
                for key in fields:
                    if key not in answer and "default" not in fields[
                            key].split("_") and len(fields[key].split("|")) <= 1:
                        error_keys[key] = "This key is required"
                if error_keys != {}:
                    return JsonResponse(error_keys, status=401)
                error_keys = self.verifyErrorsInFields(fields, answer)
                if error_keys != {}:
                    return JsonResponse(error_keys, status=401)
                collection.insert_one(answer)
                return JsonResponse({"message": "Object created!"}, status=200)
            else:
                return JsonResponse({"Error": "400 BAD REQUEST"}, status=400)
        else:
            return (JsonResponse(
                    {"error": "405 METHOD NOT ALLOWED"}, status=405))

    # creates a API PUT
    def forgeAPIrequestPut(self, request, id, fields, collection):
        if (request.body):
            answer = json.loads(request.body.decode('utf8'))
            error_keys = {}
            new_fields = {}
            for key in answer:
                if key not in fields:
                    error_keys[key] = "The key " + \
                        str(key) + " is not authorized"
                else:
                    new_fields[key] = fields[key]
            if (error_keys != {}):
                return (JsonResponse(error_keys, status=401))
            error_keys = self.verifyErrorsInFields(new_fields, answer)
            if (error_keys != {}):
                return (JsonResponse(error_keys, status=401))
            object = collection.update_one(
                {"_id": ObjectId(id)}, {"$set": answer})
            if (object.raw_result['updatedExisting'] is False):
                return(JsonResponse({"Error": "Id not found!"}, status=404))
            return(JsonResponse({"message": "Object updated!"}, status=200))
        else:
            return (JsonResponse({"Error": "400 BAD REQUEST"}, status=400))

    # creates a API DELETE Endpoint
    def forgeAPIrequestDelete(self, request, fields, collection):
        if (request.method == "DELETE"):
            return (HttpResponse("200 OK"))
        else:
            return (HttpResponse("401 Unauthorized"))
