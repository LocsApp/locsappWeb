from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions
from django.contrib.auth.forms import SetPasswordForm
from django.conf import settings


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        living_address = serializers.ListField(child=serializers.CharField())
        billing_address = serializers.ListField(serializers.ListField(child=serializers.CharField()))
        secondary_emails = serializers.ListField(serializers.ListField(child=serializers.CharField()))

        fields = ('username', 'email', 'secondary_emails', 'first_name', 'last_name', 'birthdate', 'phone', 'living_address',
                  'registered_date', 'last_activity_date', 'billing_address', 'logo_url', "is_active", "role")
        read_only_fields = ('username', 'role', 'email', 'registered_date', 'last_activity_date', 'logo_url',
                            'is_active')


class PasswordChangeSerializer(serializers.Serializer):

    old_password = serializers.CharField(max_length=128)
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)

    set_password_form_class = SetPasswordForm

    def __init__(self, *args, **kwargs):
        self.old_password_field_enabled = getattr(
            settings, 'OLD_PASSWORD_FIELD_ENABLED', False
        )
        self.logout_on_password_change = getattr(
            settings, 'LOGOUT_ON_PASSWORD_CHANGE', False
        )
        super(PasswordChangeSerializer, self).__init__(*args, **kwargs)

        if not self.old_password_field_enabled:
            self.fields.pop('old_password')

        self.request = self.context.get('request')
        self.user = getattr(self.request, 'user', None)

    def validate_old_password(self, value):
        invalid_password_conditions = (
            self.old_password_field_enabled,
            self.user,
            not self.user.check_password(value)
        )

        if all(invalid_password_conditions):
            raise serializers.ValidationError('Invalid password')
        return value

    def validate(self, attrs):
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )
        user = get_user_model().objects.get(username=self.request.user)
        print("user = ", user.email)
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        return attrs

    def save(self):
        self.set_password_form.save()
        if not self.logout_on_password_change:
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(self.request, self.user)