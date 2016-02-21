from django.http import JsonResponse


class CheckUsernameExistMiddleware(object):

    def process_response(self, request, response):
        if request.user.is_anonymous() == False and request.user.username == "":
            response.status_code = 499
            response.content = JsonResponse({'message':'Username empty'})
        return response

