#Django imports
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

#JSON import
import json

class APIRequestMongo:

	"""
	verifies is the fields are correct:
	text, <number> : verify if the text is small enough
	integer : verify that it is an integer
	"""
	def verifyErrorsInFields(self, fields, answer):
		error_fields = {}
		for key in fields:
			temp_options = fields[key].split(",")
			if (temp_options[0] == "text"):
				if (len(answer[key]) > int(temp_options[1]) or len(answer[key]) <= 0):
					error_fields[key] = "The text must not be empty and the length must be inferior or equal to" + temp_options[1]
			elif (temp_options[0] == "integer"):
				if (type(answer[key]) != type(1)):
					error_fields[key] = "The field must be an integer"
			temp_options = []
		return (error_fields)

	#creates a Create API POST
	def forgeAPIrequestCreate(self, method, request, fields, collection):
		if (request.method == method):
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
				return(HttpResponse("200 OK"))
			else:
				return (HttpResponse("400 BAD REQUEST"))
		else :
			return (HttpResponse("405 METHOD NOT ALLOWED"))

	#creates a API DELETE Endpoint
	def forgeAPIrequestDelete(self, request, fields, collection):
		if (request.method == "DELETE"):
			return (HttpResponse("200 OK"))
		else:
			return (HttpResponse("401 Unauthorized"))