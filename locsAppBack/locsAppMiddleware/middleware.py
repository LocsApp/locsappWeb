from django.http import JsonResponse


class CheckUsernameExistMiddleware(object):

    def __init__(self):
        view_name = "test"

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Get the view name as a string
        view_name = '.'.join((view_func.__module__, view_func.__name__))
        # If the view name is in our exclusion list, exit early
        self.view_name = view_name
        return None

    def process_response(self, request, response):
        if hasattr(self, "view_name") and self.view_name == "API.views.ChangeUsername" and request.user.is_anonymous(
        ) == False and request.user.username == "":
            response.status_code = 499
            response.content = JsonResponse({'message': 'Username empty'})
        return response
