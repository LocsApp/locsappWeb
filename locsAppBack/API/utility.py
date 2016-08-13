from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token


class Utility:

    @staticmethod
    def checkUserAuthenticated(request):
        if 'HTTP_AUTHORIZATION' in request.META:
            print("checkUserAuthenticated 2", request.META['HTTP_AUTHORIZATION'])
            token = request.META['HTTP_AUTHORIZATION'].split()[1]
            try:
                # We check if the token is in the database and we update the user model
                user = Token.objects.get(key=token).user
                return user
            except Token.DoesNotExist:
                return False
        else:
            return False
