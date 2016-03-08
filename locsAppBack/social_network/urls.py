from django.conf.urls import url
from . import views

social_patterns = [
	url(r'^auth/facebook-register', views.FacebookRegister.as_view(), name='fb_register'),
]
