from django.conf.urls import include, url
# django_rest_framework
from rest_framework.authtoken.views import obtain_auth_token
# importing local views
from . import views
from django.views.generic.base import RedirectView

from allauth.account.views import confirm_email


"""
@apiDefine UserObjectRegisterDefine

@apiParam {String} username Username of the user
"""


article_patterns = [
    url(r'^create/$', views.postNewArticle),
    url(r'^delete/$', views.deleteArticle),
]

user_patterns = [
    url(r'^(?P<user_pk>[0-9]+)/living_addresses/$'),
]

# General urls for the api
api_patterns = [
    url(r'^rest-auth/facebook/$', views.FacebookLogin.as_view()),
    url(r'^rest-auth/google/$', views.GoogleLogin.as_view()),

    url(r'^articles/', include(article_patterns)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^email-sent/', RedirectView.as_view(url='http://127.0.0.1:8080/', permanent=False),
        name="account_email_verification_sent"),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls'), name='registrationUser'),
    url(r'^verify-email/(?P<key>\w+)/$', confirm_email, name="account_confirm_email"),
    #url(r'^/user/', include(user_patterns))
]