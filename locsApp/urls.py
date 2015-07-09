from django.conf.urls import include, url
from django.contrib import admin
from .views import IndexView

urlpatterns = [
    # Examples:
    # url(r'^$', 'locsApp.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url('^.*$', IndexView.as_view(), name='index'),
]
