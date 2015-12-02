from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        scores = serializers.ListField(child=serializers.IntegerField(min_value=0, max_value=100))
        living_address = serializers.ListField(child=serializers.CharField())

        fields = ('scores', 'username', 'email', 'first_name', 'last_name', 'birthdate', 'phone', 'living_address',
                  'registered_date', 'last_activity_date', 'billing_address', 'logo_url', "is_active", "role")
        read_only_fields = ('username', 'role', 'email', 'registered_date', 'last_activity_date', 'logo_url',
                            'is_active')

