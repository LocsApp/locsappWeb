from django.conf.urls import include, url
# importing local views
from . import views
from . import articles
from . import static_collections
from django.views.generic.base import RedirectView
from allauth.account.views import confirm_email
from social_network import views as social_network_views
from . import favorites
from . import questions
from . import notations
from . import users

"""
@apiDefine UserObjectRegisterDefine

@apiParam {String} username Username of the user
"""

article_patterns = [
    url(r'^create/$', articles.postNewArticle),
    url(r'^(?P<article_pk>[a-f\d]{24})/$',
        articles.articleAlone),
    url(r'^get/(?P<article_pk>[a-f\d]{24})/$',
        articles.getArticle),
    url(r'^image-upload-article/$',
        views.ImageArticleUploadView.as_view(),
        name='image-upload-article'),
    url(r'^seller/(?P<user_pk>[0-9]+)/$',
        articles.FindUserByIdForArticle.as_view()),
    url(r'^report/$', articles.sendReport),
    url(r'^demands/$', articles.demandsMain),
    url(r'^demands-as-renting/$', articles.demandsAsRenting),
    url(r'^refuse-demand/$', articles.refuseDemand),
    url(r'^retract-demand/$', articles.retractDemand),
    url(r'^accept-demand/$', articles.acceptDemand),
    url(r'^current-timelines/$', articles.currentTimelines),
    url(r'^current-timelines-as-renting/$', articles.currentTimelinesAsRenting),
    url(r'^give-mark/$', articles.postNewMark),
    url(r'^get-pending-marks-for-clients/(?P<id_page>[0-9]+)/$', articles.getMarkForClient),
    url(r'^get-pending-marks-for-renters/(?P<id_page>[0-9]+)/$', articles.getMarkForRenter),
    url(r'^questions/$', questions.sendQuestion),
    url(r'^answers/$', questions.answerQuestion),
    url(r'^upvote/$', questions.thumbsUp),
    url(r'^report-question/$', questions.report),
    url(r'^articles-with-question-to-answer/(?P<id_page>[0-9]+)/$', questions.articleWithQuestionToAnswer),
    url(r'^articles-with-question-asked/(?P<id_page>[0-9]+)/$', questions.articleWithQuestionUserAsked),
    url(r'^user-profile/(?P<user_pk>[0-9]+)/$',
        articles.getFirstFourArticleOwnedByUser),
    url(r'^all/(?P<user_pk>[0-9]+)/(?P<id_page>[0-9]+)/$',
        articles.getAllArticleOwnedByUser),
    ]

history_patterns = [
    url(r'^articles-as-client/(?P<id_page>[0-9]+)/$', articles.getArticleHistoryAsClient),
    url(r'^articles-as-renter/(?P<id_page>[0-9]+)/$', articles.getArticleHistoryAsRenter),
    url(r'^notations-as-renter/(?P<id_page>[0-9]+)/$', articles.getNotationsAsRenter),
    url(r'^notations-as-client/(?P<id_page>[0-9]+)/$', articles.getNotationsAsClient),
    url(r'^notations-profile/(?P<user_pk>[0-9]+)/$', notations.getFirstFourNotationOwnedByUser),
    url(r'^notations-as-client-pagination/(?P<username>\w+)/(?P<id_page>[0-9]+)/$', notations.getAllNotationAsClientByUser),
    url(r'^notations-as-renter-pagination/(?P<username>\w+)/(?P<id_page>[0-9]+)/$',
        notations.getAllNotationAsRentertByUser),

]

favorite_patterns = [
    url(r'^articles/(?P<id_page>[0-9]+)/$', favorites.getFavoriteArticle),
    url(r'^add-articles/$', favorites.addFavoriteArticle),
    url(r'^delete-articles/$', favorites.deleteFavoriteArticle),

]

search_patterns = [
    url(r'^notifications/(?P<user_pk>[0-9]+)/$',
        views.searchNotificationsUser),
    url(r'^notifications/(?P<user_pk>[0-9]+)/read-all/$',
        views.notificationsUserAllRead),
    url(r'^articles/$',
        articles.searchArticles),
   # url(r'timeline-as-renting/$', views.paginationTimelineAsRenting),
   # url(r'timeline-as-renter/$', views.paginationTimelineAsRenter),
   # url(r'demands-as-renting/$', views.paginationDemandsAsRenting),
   # url(r'demands-as-renter/$', views.paginationDemandsAsRenter),
   # url(r'notations-as-client/$', views.paginationNotationsAsClient),
   # url(r'notations-as-renter/$', views.paginationNotationsAsRenter),

]

notifications_patterns = [
    url(
        r'^(?P<notification_pk>[a-f\d]{24})/$',
        views.notificationAlone),
]

user_patterns = [
    url(r'^preview-article/$', views.GetNotationPreviewArticle.as_view()),
    url(r'^change-email/$', views.addEmailUser.as_view()),
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
        views.notificationsUser),
    url(r'^image-upload-avatar/$',
        views.ImageAvatarUploadView.as_view(),
        name='image-upload-avatar'),
    url(r'^(?P<username>\w+)/$', users.getUserByUsername.as_view()),
    url(r'^(?P<username>\w+)/(?P<lat>-?\d+\.\d+)/(?P<long>-?\d+\.\d+)/$', users.getUserByUsernameLongLat.as_view()),
    url(r'^verify-profile-full/$', views.verifyProfileFull.as_view()),

]

# Static collections urls
static_collections_patterns = [
    url(r'^base-categories/$', static_collections.staticBaseCategories),
    url(r'^sub-categories/$', static_collections.staticSubCategories),
    url(r'^genders/$', static_collections.staticGenders),
    url(r'^sizes/$', static_collections.staticSizes),
    url(r'^clothe-colors/$', static_collections.staticClotheColors),
    url(r'^clothe-states/$', static_collections.staticClotheStates),
    url(r'^payment-methods/$', static_collections.staticPaymentMethods),
    url(r'^reports-types/$', static_collections.staticReportTypes),
]

# Cache urls
cache_patterns = [
    url(r'^static-collections/(?P<argument>[0-1]{1})/$',
        views.checkStaticCollectionVersion.as_view()),
]

# General urls for the api
api_patterns = [

    url(r'^auth/facebook-login/',
        social_network_views.FacebookLogin.as_view(),
        name='fb_login'),
    url(r'^auth/facebook-register',
        social_network_views.FacebookRegister.as_view(),
        name='fb_register'),

    url(r'^articles/', include(article_patterns)),
    url(r'^favorites/', include(favorite_patterns)),
    url(r'^history/', include(history_patterns)),
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
    url(r'^search/', include(search_patterns)),
    url(r'^static-collections/',
        include(static_collections_patterns)),
    url(r'^cache/',
        include(cache_patterns)),
]

#