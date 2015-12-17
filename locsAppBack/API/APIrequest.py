# Django imports
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# JSON import
import json

# Pymongo imports
from pymongo import MongoClient


class APIRequestMongo:

    """
    verifies is the fields are correct:
    text, <number> : verify if the text is small enough
    integer : verify that it is an integer,
    boolean : verify that it is a boolean
    """

    def verifyErrorsInFields(self, fields, answer):
        error_fields = {}
        for key in fields:
            temp_options = fields[key].split(",")
            if (temp_options[0] == "text"):
                if (len(answer[key]) > int(temp_options[1])
                        or len(answer[key]) <= 0):
                    error_fields[
                        key] = "The text must not be empty and the length must be inferior or equal to" + temp_options[1]
            elif (temp_options[0] == "integer"):
                if (not isinstance(answer[key], type(1))):
                    error_fields[key] = "The field must be an integer"
            elif (temp_options[0] == "boolean"):
                if (not isinstance(answer[key], type(True))):
                    error_fields[key] = "The field must be a boolean"
            temp_options = []
        return (error_fields)

    # creates a Create API POST
    def forgeAPIrequestCreate(self, method, request, fields, collection):
        if (request.method == "POST"):
            if (request.body):
                answer = json.loads(request.body.decode('utf8'))
                error_keys = {}
                for key in fields:
                    if key not in answer:
                        error_keys[key] = "This key is required"
                if (error_keys != {}):
                    return (JsonResponse(error_keys))
                error_keys = self.verifyErrorsInFields(fields, answer)
                if (error_keys != {}):
                    return (JsonResponse(error_keys))
                collection.insert_one(answer)
                return(JsonResponse({"message": "Notification created!"}, status=200))
            else:
                return (JsonResponse({"error": "400 BAD REQUEST"}, status=400))
        else:
            return (JsonResponse(
                    {"error": "405 METHOD NOT ALLOWED"}, status=405))

    # creates a API DELETE Endpoint
    def forgeAPIrequestDelete(self, request, fields, collection):
        if (request.method == "DELETE"):
            return (HttpResponse("200 OK"))
        else:
            return (HttpResponse("401 Unauthorized"))
