# locsappWeb

Le projet fonctionne en CI pour le voir merci d'aller a l'URL suivante:
http://jenkins.sylflo.fr/job/LocsApp

Pour lancer le serveur 
1.  installer virtualenwrapper
2.  Mettre ceci dans le fichier de config de votre shell (ex .bashrc)

```
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3.4
export WORKON_HOME=~/.virtualenvs
mkdir -p $WORKON_HOME
source /usr/bin/virtualenvwrapper.sh
```
3. Pour créer un env virtuel `mkvirtualenv --python=/usr/bin/python3 locsApp`
4. faites un `python -V` cela doit retourner la version 3.4.3
5. faites un `which python` celui-ci ne doit pas pointer dans le dossier /bin
6. Ensuite  faites un `pip install -r requirements.txt`

Si vous voulez quitter l'env virtuel faites `deactivate`
Et pour y revenir `workon locsApp`

Pour lancer le serveur une fois que vous êtes dans l'env virtuel faites
```
./manage.py makemigrations
./manage.py migrate
./manage.py runserver
```

La documentation de l'API se trouve ici: (elle sera remplacé par swagger d'ici un certain temps
locahost:8000/doc
