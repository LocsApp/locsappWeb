from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token


class UpdateLastActivityMiddleware(object):
	def process_view(self, request, view_func, view_args, view_kwargs):

		if 'HTTP_AUTHORIZATION' in request.META:
			token = request.META['HTTP_AUTHORIZATION'].split()[1]
			try:
				# We check if the token is in the database and we update the user model
				user = Token.objects.get(key=token).user
				get_user_model().objects.filter(pk=user.pk).update(
					last_activity_date=timezone.now())
			except Token.DoesNotExist:
				pass
