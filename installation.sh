#Creer un env virtual en premier lieu

#!/usr/bin/sh

npm install
pip install
./manage.py makemigrations
./manage.py migrate
./manage.py bower install
./manage.py runserver
