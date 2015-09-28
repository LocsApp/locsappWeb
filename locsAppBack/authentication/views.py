from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.hashers import check_password
from django.core.mail import EmailMessage
from .models import Account
from .permissions import IsAccountOwner
from .serializers import AccountSerializer
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

import json


class AccountViewSet(viewsets.ModelViewSet):
    """
     **Account for breakage (ModelViewSet)
     We only use post get for one user and put for modification**

    """
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        """
        *Anyone can create an account and get user information (Get, Post)
        Only user can modify their profile (Put, Patch)*::

            if self.request.method in permissions.SAFE_METHODS:
                return permissions.AllowAny(),

            if self.request.method == 'POST':
                return permissions.AllowAny(),

            return permissions.IsAuthenticated(), IsAccountOwner(),
        """
        if self.request.method in permissions.SAFE_METHODS:
            return permissions.AllowAny(),

        if self.request.method == 'POST':
            return permissions.AllowAny(),

        return permissions.IsAuthenticated(), IsAccountOwner(),

    def create(self, request):
        """
        *Create a new account only breakage*\n
        :return HTTP_201_CREATED or HTTP_400_BAD_REQUEST::

            serializer = self.serializer_class(data=request.data)

            if serializer.is_valid():
                Account.object.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        """
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.object.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        print(serializer.errors)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data'
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, username):
        """
        *We update user information but verify the user by his password*::

            Account.object.update()
            user = self.get_object()
            serializer = AccountSerializer(user, data=request.data)

            if serializer.is_valid():
                actual_password = serializer.validated_data.get('password')
                new_password = serializer.validated_data.get('new_password')
                confirm_new_password = serializer.validated_data.get('confirm_new_password')
                email = serializer.validated_data.get('email')
                if check_password(actual_password, user.password):
                    serializer.save()

                    user = Account.objects.get(email=email)
                    user.set_password(actual_password)
                    user.save()

            #necessary if we change the password else the user will bes disconnected
            update_session_auth_hash(request, user)

        """
        Account.object.update()
        user = self.get_object()
        serializer = AccountSerializer(user, data=request.data)

        if serializer.is_valid():
            actual_password = serializer.validated_data.get('password')
            new_password = serializer.validated_data.get('new_password')
            confirm_new_password = serializer.validated_data.get('confirm_new_password')
            email = serializer.validated_data.get('email')
            if check_password(actual_password, user.password):
                serializer.save()

                user = Account.objects.get(email=email)
                user.set_password(actual_password)
                user.save()

                if new_password is not None and new_password != "" and new_password == confirm_new_password \
                        and check_password(actual_password, user.password):
                    user = Account.objects.get(email=email)
                    user.set_password(new_password)
                    user.save()

            update_session_auth_hash(request, user)

        else:
            print(serializer.errors)

        return Response(serializer.validated_data, status=status.HTTP_202_ACCEPTED)

        # print("UPDATE VIEWWWW")


class LoginView(views.APIView):
    """
    **Log the user with his email**:


    """
    def post(self, request, format=None):
        """
        *We verify if the account exist and is active*::

            data = json.loads(request.body.decode('utf-8'))

            email = data.get('email', None)
            password = data.get('password', None)

            account = authenticate(email=email, password=password)

        :return: HTTP_200_OK or HTTP_401_UNAUTHORIZED
        """
        data = json.loads(request.body.decode('utf-8'))

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)
                return Response(serialized.data, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled  '
                }, status=status.HTTP_401_UNAUTHORIZED)

        else:

            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    """
    **We only logout user connected**::

        permission_classes = (permissions.IsAuthenticated,)
    """
    permission_classes = (permissions.IsAuthenticated,)


    def post(self, request, format=None):
        """
        *Simple logout*
        :return: HTTP_204_NO_CONTENT::

            logout(request)

            return Response({}, status=status.HTTP_204_NO_CONTENT)

        """
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class AskNewPassword(views.APIView):
    """
    **Anyone can access this page.**
    """
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):

        """
        *We get user mail and verify if user exists*
        :return: status.HTTP_200_OK or status.HTTP_400_BAD_REQUEST)::

            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            user = None
            try:
                user = Account.objects.get(email=email)
            except ObjectDoesNotExist:
                return Response({}, status.HTTP_400_BAD_REQUEST)
            password = Account.objects.make_random_password()
            user.set_password(password)
            user.save()
        """

        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
         #test_user = Account.object.filter(email=email)
        user = None
        try:
            user = Account.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({}, status.HTTP_400_BAD_REQUEST)
        #user = Account.objects.get(email=email)
        #if user is None:
        #    return Response({}, status.HTTP_400_BAD_REQUEST)

        password = Account.objects.make_random_password()
        user.set_password(password)
        user.save()
        message = 'Ceci est un message votre mail est ' + str(email) + ' votre nouveau mot de passe est ' + str(
            password)
        mail = EmailMessage('La bonne piece', message, to=['dev.chateau@gmail.com'])
        mail.send()

        return Response({}, status=status.HTTP_200_OK)


