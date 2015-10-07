#!/bin/sh

cd /var/www/locsapp.sylflo.fr/locsappWeb
eval `ssh-agent`
ssh-add /var/lib/jenkins/.ssh/locsAppGitHub_rsa
git checkout .
git pull

source /var/lib/jenkins/.virtualenvs/locsApp/bin/activate   
pip install -r /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/requirements.txt
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py collectstatic --noinput
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py makemigrations
python  /var/www/locsapp.sylflo.fr/locsappWeb/locsAppBack/manage.py migrate
cd /var/www/locsapp.sylflo.fr/locsappWeb/locsAppFrontWeb/dev/
npm install
/var/www/locsapp.sylflo.fr/locsappWeb/locsAppFrontWeb/dev/launch_all_gulp.sh
sudo /etc/init.d/nginx  restart

