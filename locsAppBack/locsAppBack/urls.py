"""
locasappWeb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

from django.conf.urls import include, url
from django.contrib import admin
from API.views import *
from API.urls import *

urlpatterns = [
    url(r'^accounts-social-network/', include('allauth.socialaccount.urls')),
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^api/v1/admin/', include(admin.site.urls)),
    # Url including the API end-points
    url(r'^robots\.txt$', include('robots.urls')),

    url(r'^api/v1/', include(api_patterns)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT,
    })
]
