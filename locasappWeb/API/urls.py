from django.conf.urls import include, url

user_patterns = [
	#url(r'^$', ),
]

api_patterns = [
	url(r'^users/$', include(user_patterns)),
]