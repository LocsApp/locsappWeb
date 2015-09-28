__author__ = 'sylflo'

from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from .models import Account
from rest_framework.authtoken.models import Token


class AccountSerializer(serializers.ModelSerializer):
    """
    *We serialize models we use all of this fields*::

        class Meta:
            model = Account
            fields = ('id', 'email', 'username', 'name_enterprise', 'phone', 'address', 'created_at', 'password',
                  'new_password', 'confirm_new_password')
            read_only_fields = ('created_at', )


    """
    password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_new_password = serializers.CharField(write_only=True, allow_blank=True, required=False)

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'name_enterprise', 'phone', 'address', 'created_at', 'password',
                  'new_password', 'confirm_new_password')
        read_only_fields = ('created_at', )

        def create(self, validated_data):
            return Account.object.create(**validated_data)
