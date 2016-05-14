# Django imports
from django.http import JsonResponse
from django.http import HttpResponse

# JSON import
import json
import bson
from bson import json_util
from django.http import HttpResponse

# Pymongo imports
from bson.objectid import ObjectId

import pytz
from datetime import datetime


class APIRequestMongo:

    def __init__(self, db):
        self.grammar = [
            "_type",
            "_default",
            "_length",
            "_protected",
            "_required",
            "_min",
            "_max"]
        self.db = db

    """
    This method is intern to the class and should not be invoked outside it.
    It checks a key looking at its pattern describe in the model.
    """

    def _fieldModelValidation(
            self, attribute, model_attribute, error_fields, key):
        modelType = None
        if isinstance(model_attribute, type({})):
            if ("_type" in model_attribute and not isinstance(model_attribute[
                    "_type"], type({})) and not isinstance(model_attribute["_type"], type([]))):
                modelType = model_attribute["_type"]
            elif "_type" in model_attribute and isinstance(model_attribute["_type"], type([])):
                if not isinstance(attribute, (type([]))):
                    error_fields[key] = "This field must be an array"
                    return False
                else:
                    for subObject in attribute:
                        return self._fieldModelValidation(
                            subObject, model_attribute["_type"][0], error_fields, key +
                            ".subfield")
        elif isinstance(model_attribute, type([])):
            if not isinstance(attribute, (type([]))):
                error_fields[key] = "This field must be an array"
                return False
            else:
                for subObject in attribute:
                    return self._fieldModelValidation(
                        subObject, model_attribute[0], error_fields, key + ".subfield")
        else:
            modelType = model_attribute
        if (bson.objectid.ObjectId.is_valid(str(modelType)) == True):
            if (not bson.objectid.ObjectId.is_valid(attribute)):
                error_fields[key] = "This field must be an id."
                return False
            if (isinstance(model_attribute, type({})) and "_protected" in
                    model_attribute and model_attribute["_protected"]):
                pass
            else:
                return True
        elif not isinstance(attribute, modelType):
            error_fields[key] = "This field must be a " + \
                modelType.__name__
            return False
        modelType = model_attribute
        if isinstance(modelType, type({})):
            if "_protected" in modelType and modelType["_protected"]:
                error_fields[key] = "This field is protected"
                return False
            if "_length" in modelType:
                if len(str(attribute)) > modelType["_length"]:
                    error_fields[key] = "The length must not exceed " +\
                        str(modelType["_length"]) + " characters."
                    return (False)
            if "_min" in modelType:
                if attribute < modelType["_min"]:
                    error_fields[
                        key] = "The value must ge greater than " + str(modelType["_min"])
                    return False
            if "_max" in modelType:
                if attribute > modelType["_max"]:
                    error_fields[
                        key] = "The value must ge lower than " + str(modelType["_min"])
                    return False
        return True

    """
    This checks for primary keys, if not existing, if there is a default or if it is required.
    """

    def _fieldDefaultNotRequired(self, document, model_attribute, key):
        if isinstance(model_attribute, type({})):
            if "_required" in model_attribute:
                if not model_attribute["_required"]:
                    return True
            if "_default" in model_attribute:
                document[key] = model_attribute["_default"]
                return True
        return False

    """
    This method creates a POST endpoint for a mongo API
    """

    def POST(self, request, model, collection_name,
             success_message, verification_callback=None):
        if request.body:
            body = json.loads(request.body.decode('utf8'))
            keys_error = {}
            document = {}
            for key in body:
                if key not in model:
                    keys_error[key] = "This key is not authorized."
                else:
                    self._fieldModelValidation(
                        body[key], model[key], keys_error, key)
                    document[key] = body[key]
                    model.pop(key, None)
            if model:
                missing_keys = {}
                for key in model:
                    if not self._fieldDefaultNotRequired(
                            document, model[key], key):
                        missing_keys[key] = "This key is missing"
            keys_error.update(missing_keys)
            if keys_error:
                return JsonResponse(keys_error, status=401)
            if (verification_callback is None):
                self.db[collection_name].insert_one(document)
            else:
                testVerification = verification_callback(document)
                if (testVerification is True):
                    self.db[collection_name].insert_one(document)
                else:
                    return (JsonResponse(
                        testVerification, status=401))
            return (JsonResponse(
                {"message": success_message}, status=200))

    """
    This method creates a PUT endpoint for a mongo API
    """

    def PUT(self, request, model, collection_name, success_message, id):
        if request.body:
            body = json.loads(request.body.decode('utf8'))
            keys_error = {}
            document = {}
            for key in body:
                if key not in model:
                    keys_error[key] = "This key is not authorized."
                else:
                    self._fieldModelValidation(
                        body[key], model[key], keys_error, key)
                    document[key] = body[key]
                    model.pop(key, None)
            if keys_error:
                return JsonResponse(keys_error, status=401)
            self.db[collection_name].update_one(
                {"_id": ObjectId(id)}, {"$set": document})
            return (JsonResponse(
                    {"message": success_message}, status=200))

    """
    This method creates a GET endpoint for a mongo API

    """

    def GET(self, collection_name, id=None, raw=False, special_field=None):
        print(type(collection_name))
        print(type(id))
        if id is None and special_field is None:
            documents = self.db[collection_name].find({})
            answer = {collection_name: []}
            for instance in documents:
                answer[collection_name].append(
                    self.parseObjectIdToStr(instance))
        if id:
            answer = self.parseObjectIdToStr(
                self.db[collection_name].find_one({"_id": ObjectId(id)}))
        if special_field:
            documents = self.db[collection_name].find(
                special_field)
            answer = {collection_name: []}
            for instance in documents:
                answer[collection_name].append(
                    self.parseObjectIdToStr(instance))
        if (raw is True):
            return (answer)
        else:
            return HttpResponse(json.dumps(
                answer, sort_keys=True, indent=4, default=json_util.default))

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
            if temp_options[0] == "integer_protected":
                if key in answer:
                    error_fields[key] = "This field is protected"
            # Parsing of default values
            if (len(fields[key].split("|")) ==
                    2 and key not in answer and creation is True):
                if temp_options[0] == "integer":
                    answer[key] = int(fields[key].split("|")[1])
                else:
                    answer[key] = fields[key].split("|")[1]
            # Verification of input values
            if temp_options[0] == "text":
                if not isinstance(answer[key], type("kek")):
                    error_fields[key] = "It must be a string"
                elif len(answer[key]) > int(temp_options[1]) or len(answer[key]) <= 0:
                    error_fields[
                        key] = "The text must not be empty and the length must be inferior" \
                        " or equal to" + temp_options[1]
            elif temp_options[0] == "integer":
                if not isinstance(answer[key], type(1)):
                    error_fields[key] = "The field must be an integer"
            elif temp_options[0] == "boolean":
                if not isinstance(answer[key], type(True)):
                    error_fields[key] = "The field must be a boolean"
            elif temp_options[0] == "date_default":
                answer[key] = datetime.now(pytz.utc)
            elif temp_options[0] == "array":
                if not isinstance(answer[key], type([])):
                    error_fields[key] = "The field must be a list"
            elif temp_options[0] == "dict":
                if not isinstance(answer[key], type({})):
                    error_fields[key] = "The field must be a dictionnary"
            elif temp_options[0] == "id":
                if not bson.objectid.ObjectId.is_valid(answer[key]):
                    error_fields[key] = "The field must be a MongoDB ID"

            temp_options = []
        return error_fields

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
        if request.body:
            answer = json.loads(request.body.decode('utf8'))
            error_keys = {}
            new_fields = {}
            for key in answer:
                if key not in fields:
                    error_keys[key] = "The key " + \
                        str(key) + " is not authorized"
                else:
                    new_fields[key] = fields[key]
            if error_keys != {}:
                return JsonResponse(error_keys, status=401)
            error_keys = self.verifyErrorsInFields(new_fields, answer)
            if error_keys != {}:
                return JsonResponse(error_keys, status=401)
            object = collection.update_one(
                {"_id": ObjectId(id)}, {"$set": answer})
            if object.raw_result['updatedExisting'] is False:
                return JsonResponse({"Error": "Id not found!"}, status=404)
            return JsonResponse({"message": "Object updated!"}, status=200)
        else:
            return JsonResponse({"Error": "400 BAD REQUEST"}, status=400)

    # creates a API DELETE Endpoint
    def forgeAPIrequestDelete(self, request, fields, collection):
        if request.method == "DELETE":
            return HttpResponse("200 OK")
        else:
            return HttpResponse("401 Unauthorized")
