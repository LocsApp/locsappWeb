from fabric.api import local, run, cd, env, prefix
import os

REMOTE_WORKING_DIR = '/var/www/locsappWeb/locsAppBack'

env.hosts = ['sylflo.fr']
env.user = 'locs_app'
 
def push(branch='master', remote='origin', runlocal=True):
    if runlocal:
        # lance la commande en local
        local("git push %s %s" % (remote, branch))
    else:
        # lance la commande sur les serveurs de la liste eng.hosts
        run("git push %s %s" % (remote, branch))
 
def pull(branch='master', remote='origin', runlocal=True):
    if runlocal:
        local("git pull %s %s" % (remote, branch))
    else:
        run("git pull %s %s" % (remote, branch))
 
def sync(branch='master', remote='origin', runlocal=True):
    pull(branch, remote, runlocal)
    push(branch, remote, runlocal)
 
def deploy(branch='master', remote='origin'):
    push(branch, remote, True)
    # execute toutes les commandes dans ce dossier
    with cd(REMOTE_WORKING_DIR):
        # excute toutes les commandes avec celle-ci avant
        pull(branch, remote, False)
        run("/var/www/locsappWeb/deploy_script/init_django_for_prod.sh")

