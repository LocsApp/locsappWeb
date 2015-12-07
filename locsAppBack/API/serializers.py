from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions
from django.contrib.auth.forms import SetPasswordForm
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.forms import PasswordResetForm
from django.utils.translation import ugettext_lazy as _

UserModel = get_user_model()


class UserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        living_address = serializers.ListField(child=serializers.CharField())
        billing_address = serializers.ListField(
            serializers.ListField(child=serializers.CharField()))
        secondary_emails = serializers.ListField(
            serializers.ListField(child=serializers.CharField()))

        fields = (
            'id', 'username', 'email', 'secondary_emails', 'first_name', 'last_name', 'birthdate', 'phone',
            'living_address',
            'registered_date', 'last_activity_date', 'billing_address', 'logo_url', "is_active", "role")
        read_only_fields = ('id', 'username', 'role', 'email', 'registered_date', 'last_activity_date', 'logo_url',
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
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        user = get_user_model().objects.get(username=self.user)
        send_mail('Change password', 'Your changed the password of your account ' + self.user.username + '',
                  settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
        return attrs

    def save(self):
        self.set_password_form.save()
        if not self.logout_on_password_change:
            from django.contrib.auth import update_session_auth_hash

            update_session_auth_hash(self.request, self.user)


class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset e-mail.
    """

    email = serializers.EmailField()

    password_reset_form_class = PasswordResetForm

    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(
            data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        if not UserModel.objects.filter(email=value).exists():
            raise serializers.ValidationError(_('Invalid e-mail address'))

        return value

    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
        }
        self.reset_form.save(**opts)
