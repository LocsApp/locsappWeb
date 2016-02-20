from django.conf.urls import include, url
# django_rest_framework
from rest_framework.authtoken.views import obtain_auth_token
# importing local views
from . import views
from . import articles
from django.views.generic.base import RedirectView

from allauth.account.views import confirm_email

"""
@apiDefine UserObjectRegisterDefine

@apiParam {String} username Username of the user
"""


article_patterns = [
    url(r'^create/$', articles.postNewArticle),
    url(r'^(?P<article_pk>[a-f\d]{24})/$',
        articles.articleAlone),
]

search_patterns = [
    url(r'^notifications/(?P<user_pk>[0-9]+)/$',
        views.searchNotificationsUser),
    url(r'^notifications/(?P<user_pk>[0-9]+)/read-all/$',
        views.notificationsUserAllRead)
]

notifications_patterns = [
    url(
        r'^(?P<notification_pk>[a-f\d]{24})/$',
        views.notificationAlone),
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
    url(r'^(?P<user_pk>[0-9]+)/notifications/$',
        views.notificationsUser)
]

# General urls for the api
api_patterns = [

    url(r'^rest-auth/facebook/', views.FacebookLogin.as_view(), name='fb_login'),

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
    url(r'^user/', include(user_patterns)),
    url(r'^notifications/', include(notifications_patterns)),
    url(r'^search/', include(search_patterns))
]
