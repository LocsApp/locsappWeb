#!/bin/bash


# We first need to create the dist tar and scp 
cd /Users/sylflo/project/epitech/locsapp/locsappweb/locsAppFrontWeb
gulp config-hostname --env="production"
gulp build
tar -cvf dist.tar dist
eval `ssh-agent`
ssh-add ~/.ssh/locsappDebianServer_rsa
scp -P 2121 dist.tar locsapp@sylflo.fr:/home/www/locsapp.sylflo.fr/locsAppFrontWeb/

ssh -p 2121 locsapp@sylflo.fr /home/locsapp/scritps/locsapp.sylflo.fr/updateWebSite.sh
