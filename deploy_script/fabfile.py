from fabric.api import local, run, cd, env, prefix
 
REMOTE_WORKING_DIR = '/var/www/locsappWeb'
 
env.hosts = ['/var/www/locsappWeb/']
env.user = 'sylflo'
 
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
    # execute toutes les commandes dans ce dossier
    with cd(REMOTE_WORKING_DIR):
        # excute toutes les commandes avec celle-ci avant
        with prefix('workon locsAppBack'):
            pull(branch, remote, False)
            run("./manage.py collectstatic --noinput")
	    run("./manage.py makemigrations")
	    run("./manage.py migrate")
            #run("supervisorctl -c settings/prod_supervisor.ini restart all")
