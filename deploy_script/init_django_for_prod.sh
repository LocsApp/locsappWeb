#!/bin/sh

source /home/sylflo/.virtualenvs/locsAppBack/bin/activate
pip install -r /var/www/locsappWeb/locsAppBack/requirements.txt
python  /var/www/locsappWeb/locsAppBack/manage.py collectstatic --noinput
python  /var/www/locsappWeb/locsAppBack/manage.py makemigrations
python  /var/www/locsappWeb/locsAppBack/manage.py migrate

