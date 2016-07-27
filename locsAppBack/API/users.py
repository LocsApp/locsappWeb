from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserDetailsSerializer


class getUserByUsername(APIView):

    def get(self, request, username):
        try:
            User = get_user_model()
            current_user = User.objects.get(username=username)
            serializer = UserDetailsSerializer(current_user)
            dataSerialized = serializer.data
            return Response(dataSerialized)
        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)

