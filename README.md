# locsappWeb

## Preface

Le projet fonctionne en CI pour le voir merci d'aller a l'URL suivante:
http://jenkins.sylflo.fr/job/LocsApp

## Partie backend

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

**Nouvelle étape**
Lancer la commande suivante
```
./manage.py loaddata API
```
Cette commande va faire deux choses importantes:

* Elle va créer un utilisateur s'appelant locsapp avec le mot de passe toto42,
l'adresse mail utilisateur sera automatiquement vérifié.
* Elle va aussi créer un "modèle" de l'application Facebook ce qui vous permettra
de faire la connexion par ce réseau social.

Par contre si vous ne travaillez pas en localhost. 

* Il faut soit que vous modifiez les fixtures et relancer la commande ./manage.py loaddata API.
```
{
    "fields": {
      "name": "nom pour cette entité",
      "domain": "nom.domaine"
    },
    "pk": 70,
    "model": "sites.site"
  },
```
*  Ou alors il faut vous connecter à l'admin django sur [localhost:8000/admin](localhost:8000/admin). En ajoutant votre nom de domaine dans le modèle Sites. Et ensuite
en le rajoutant dans le modèle Social Application. 


**Partie MongodB**

Il est nécessaire d'avoir des docuements déjà présent pour le bon fonctionnement du backEnd. Pour cela nous avons exporté des documents.
La marche à suivre est la suivante

1. Se déplacer dans le dosier locsAppBack/API/fixtures/locsapp-mongo-2016-02-22T17-18-30
2. Lancer la commande ``` mongorestore -d locsapp ./ ```

Une fois ceci-fait vos documents ont été importé dans la db mongo locsapp


La documentation de l'API se trouve ici: (veuillez y accéder en navigation privé svp)
[http://locsapp-doc.sylflo.fr/#/](http://locsapp-doc.sylflo.fr/#/)

## Partie frontend

Installez `npm`

Installez `http-server` (serveur en nodejs léger)

```
sudo npm install http-server -g
```

Lancez `http-server` à la racine du fichier `index.html`

```
http-server ./locsAppFrontWeb/ -a 127.0.0.1 -p 8080
```

Rendez-vous sur la page d'accueil du site : [http://127.0.0.1:8080/doc](http://127.0.0.1:8080/)