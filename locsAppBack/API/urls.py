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
    url(r'^add-email/$', views.addEmailUser.as_view()),
    url(r'^delete-email/$', views.deleteEmailUser.as_view()),
    url(r'^set-primary-email/$', views.setEmailAsPrimary.as_view()),
    url(r'^(?P<user_pk>[0-9]+)/living_addresses/$',
        views.livingAddressUser.as_view()),
    url(r'^(?P<user_pk>[0-9]+)/living_addresses/delete/$',
        views.livingAddressUserDelete.as_view()),
    url(r'^(?P<user_pk>[0-9]+)/billing_addresses/$',
        views.billingAddressUser.as_view()),
    url(r'^(?P<user_pk>[0-9]+)/billing_addresses/delete/$',
        views.billingAddressUserDelete.as_view()),
]

# General urls for the api
api_patterns = [
    url(r'^rest-auth/facebook/$', views.FacebookLogin.as_view()),
    url(r'^rest-auth/google/$', views.GoogleLogin.as_view()),

    url(r'^articles/', include(article_patterns)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^email-sent/', RedirectView.as_view(url='http://127.0.0.1:3000/', permanent=False),
        name="account_email_verification_sent"),
    url(r'^rest-auth/registration/',
        include('rest_auth.registration.urls'),
        name='registrationUser'),
    url(r'^verify-email/(?P<key>\w+)/$',
        confirm_email, name="account_confirm_email"),
    url(r'^failed-verified-email/$',
        RedirectView.as_view(url='http://127.0.0.1:3000/failed-verified-email',
                             permanent=False),
        name="account_login"),
    url(r'^failed-verified-email/$',
        RedirectView.as_view(url='http://127.0.0.1:3000/failed-verified-email',
                             permanent=False),
        name="account_signup"),
    url(r'^user/', include(user_patterns))
]
