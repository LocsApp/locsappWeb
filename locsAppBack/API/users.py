from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response

import googlemaps
import json

from .serializers import UserPublicDetailsSerializer

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

class getUserByUsername(APIView):
    def get(self, request, username):
        try:
            User = get_user_model()
            consulting_user = User.objects.get(username=username)

            distance = ""
            gmaps = googlemaps.Client(key='AIzaSyDuJ5jMvOb0ZqIlksGC4VKSrJMi1OJXQLA')
            # We get the long lat from the the current user (it's for the web)
            if request.user.is_anonymous() or request.user.living_address is None \
                    or consulting_user.living_address is None or \
                            request.user.living_address is not None and len(request.user.living_address) == 0 \
                    or consulting_user.living_address is not None and len(consulting_user.living_address) == 0:
                distance = "Unknown"
            else:
                address_current_user = json.loads(request.user.living_address[0][1])
                # print("living adress", request.user.living_address[0])
                address_current_user = address_current_user['address'] + " " + str(address_current_user['postal_code']) + " " + address_current_user['city'] + " France"

                address_consulting_user = json.loads(consulting_user.living_address[0][1])
                address_consulting_user = address_consulting_user['address'] + " " + \
                                         str(address_consulting_user['postal_code']) + " " + \
                                          address_consulting_user['city'] + " France"

                distance = gmaps.distance_matrix(address_current_user, address_consulting_user)
                # print("distance = ", distance)
                if 'distance' in distance['rows'][0]['elements'][0].keys():
                    distance = distance['rows'][0]['elements'][0]['distance']['text']
                else:
                    distance = "Unknown"

            consulting_user.distance = distance
            serializer = UserPublicDetailsSerializer(consulting_user)
            dataSerialized = serializer.data
            return Response(dataSerialized)

        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)


class getUserByUsernameLongLat(APIView):
    def get(self, request, username, lat, long):
        try:
            User = get_user_model()
            consulting_user = User.objects.get(username=username)
            print("long = ", long)
            print("lat = ", lat)

            distance = ""
            gmaps = googlemaps.Client(key='AIzaSyDuJ5jMvOb0ZqIlksGC4VKSrJMi1OJXQLA')
            # We get the long lat from the the current user (it's for the web)
            if consulting_user.living_address is None \
                    or consulting_user.living_address is not None and len(consulting_user.living_address) == 0:
                distance = "Unknown"
            else:
                # We use long and latt for the current user

                address_consulting_user = json.loads(consulting_user.living_address[0][1])
                address_consulting_user = address_consulting_user['address'] + " " + \
                                         str(address_consulting_user['postal_code']) + " " + \
                                          address_consulting_user['city'] + " France"

                coord = {"lat": lat, "lng": long}
                distance = gmaps.distance_matrix(coord, address_consulting_user)

                if 'distance' in distance['rows'][0]['elements'][0].keys():
                    distance = distance['rows'][0]['elements'][0]['distance']['text']
                else:
                    distance = "Unknown"

            consulting_user.distance = distance
            serializer = UserPublicDetailsSerializer(consulting_user)
            dataSerialized = serializer.data
            return Response(dataSerialized)

        except ObjectDoesNotExist:
            return JsonResponse(
                {"message": "username does not exist"}, status=404)
