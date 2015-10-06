#!/bin/sh

source /home/sylflo/.virtualenvs/locsAppBack/bin/activate
pip install -r /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/requirements.txt
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py collectstatic --noinput
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py makemigrations
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py migrate
cd /var/www/locsapp.sylflo.fr/locsappWeb/locsAppFrontWeb/dev/
npm install
/var/www/locsapp.sylflo.fr/locsappWeb/locsAppFrontWeb/dev/launch_all_gulp.sh

