#!/bin/sh

source ~/.virtualenvs/locsAppBack/bin/activate
python  /var/www/locsappWeb/locsAppBack/ manage.py collectstatic --noinput
python  /var/www/locsappWeb/locsAppBack/ manage.py makemigrations
python  /var/www/locsappWeb/locsAppBack/ manage.py migrate

