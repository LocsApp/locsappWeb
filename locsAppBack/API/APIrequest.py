#Django imports
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

#JSON import
import json

class APIRequestMongo:

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
				return(HttpResponse("200 OK"))
			else:
				return (HttpResponse("400 BAD REQUEST"))
		else :
			return (HttpResponse("405 METHOD NOT ALLOWED"))