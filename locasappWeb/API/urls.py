from django.conf.urls import include, url
from . import views

# End points for the user
user_patterns = [
	url(r'^id/(?P<id>[0-9]+)$', views.getUserById),
]

# General urls for the api
api_patterns = [
	url(r'^users/', include(user_patterns)),
]