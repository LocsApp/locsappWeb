from django.conf.urls import include, url
# django_rest_framework
from rest_framework.authtoken.views import obtain_auth_token
# importing local views
from . import views
from django.views.generic.base import RedirectView

from allauth.account.views import confirm_email
from rest_framework_nested import routers


"""
@apiDefine UserObjectRegisterDefine

@apiParam {String} username Username of the user
"""


article_patterns = [
    url(r'^create/$', views.postNewArticle),
    url(r'^delete/$', views.deleteArticle),
]

# General urls for the api
api_patterns = [
    url(r'^articles/', include(article_patterns)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^email-sent/', RedirectView.as_view(url='http://127.0.0.1:8080/', permanent=False),
        name="account_email_verification_sent"),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls'), name='registrationUser'),
    url(r'^verify-email/(?P<key>\w+)/$', confirm_email, name="account_confirm_email"),
    url(r'^api/v1/', include(router.urls)),

]