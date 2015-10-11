from django.conf.urls import include, url
# django_rest_framework
from rest_framework.authtoken.views import obtain_auth_token
# importing local views
from . import views
from django.views.generic.base import RedirectView

article_patterns = [
	url(r'^create/$', views.postNewArticle),
]

# General urls for the api
api_patterns = [
	#url(r'^users/', include(user_patterns)),
	url(r'^articles/', include(article_patterns)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^email-sent/', RedirectView.as_view(url='http://127.0.0.1:8080/', permanent=False), name="account_email_verification_sent"),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls'), name='registrationUser'),
]