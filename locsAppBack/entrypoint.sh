#!/bin/sh

cd /app
./manage.py makemigrations 
./manage.py migrate
./manage.py loaddata API
./manage.py runserver 0.0.0.0:8000
