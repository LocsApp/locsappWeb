"""
Django settings for locsAppBack project.

Generated by 'django-admin startproject' using Django 1.8.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import socket
from os import path

PROJECT_ROOT = path.dirname(path.abspath(__file__))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# For APIDOC
MEDIA_ROOT = path.join(PROJECT_ROOT, 'templates/api_doc/src')
MEDIA_URL = '/templates/api_doc/src/'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# Removes django session login
REST_SESSION_LOGIN = False

# Aks for the old password when changing passwords
OLD_PASSWORD_FIELD_ENABLED = True

# Custom serializer for user details
REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'API.serializers.UserDetailsSerializer',
    'PASSWORD_CHANGE_SERIALIZER': 'API.serializers.PasswordChangeSerializer',
    'PASSWORD_RESET_SERIALIZER': 'API.serializers.PasswordResetSerializer'
}
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '0#bk$^5fieu@defbgkbxaadd*5y940w-k$jwf!-8=pg)hz085$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Django allauth
ACCOUNT_ADAPTER = 'API.adapter.DefaultAccountAdapterCustom'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[Locsapp]"

"""
Attempt to bypass the signup form by using fields (e.g. username, email) retrieved from the social account provider.
 If a conflict arises due to a duplicate e-mail address the signup form will still kick in.
"""

# - set it to True if you want to have old password verification on password change enpoint (default: False)
OLD_PASSWORD_FIELD_ENABLED = True
# Keep the user logged after the password has changed
LOGOUT_ON_PASSWORD_CHANGE = False


# Different user model
AUTH_USER_MODEL = 'API.Account'

# Allows all the domains to make requets on API

CORS_ORIGIN_ALLOW_ALL = True

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django_jenkins',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'robots',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
    'rest_auth',
    'rest_auth.registration',
    'rest_framework_swagger',
    'tests',
    'social_network',
    'API'
)

SITE_ID = 42

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
)

ROOT_URLCONF = 'locsAppBack.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
)

WSGI_APPLICATION = 'locsAppBack.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

if socket.gethostname() != "sylflo.fr":
    DATABASES = {
        # 'default': {
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        # }
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': u'locsapp',
            'HOST': u'localhost',
            'USER': 'locsapp',
            'PASSWORD': 'locsapp',
            'PORT': ''
        }
    }

REST_FRAMEWORK = {
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    )
}

# Jenkins
PROJECT_APPS = (
    'API',
)

JENKINS_TASKS = (
    'django_jenkins.tasks.run_pep8',
    'django_jenkins.tasks.run_pyflakes',
)

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static_root")
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
    # os.path.join(BASE_DIR, "templates/api_doc/src")
)
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Email config
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'locsapp.eip@gmail.com'
EMAIL_HOST_PASSWORD = 'Totofaitdubateau'

URL_FRONT = 'http://127.0.0.1:3000/'

if socket.gethostname() == "sylflo.fr":
    URL_FRONT = 'http://locsapp.sylflo.fr/'
    DEBUG = TEMPLATE_DEBUG = True

    REST_FRAMEWORK = {
        # 'TEST_REQUEST_DEFAULT_FORMAT': 'json',
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework.authentication.SessionAuthentication',
            'rest_framework.authentication.TokenAuthentication',
        ),
        # 'DEFAULT_RENDERER_CLASSES': (
        #    'rest_framework.renderers.JSONRenderer',
        # )
    }

    ALLOWED_HOSTS = [
        "http://locsapp.sylflo.fr",
        "locsapp.sylflo.fr",
        ".sylflo.fr",
        "sylflo.fr",
        "5.135.163.38"]
    ADMINS = (
        ('Sylvain Chateau', 'dev.chateau@gmail.com'),
    )
    DATABASES = {
        'default':
            {'ENGINE': 'django.db.backends.postgresql_psycopg2',
             'NAME': u'locsapp',
             'HOST': u'localhost',
             'USER': 'locsapp',
             'PASSWORD': '}{4KkAf7',
             'PORT': ''}
    }
