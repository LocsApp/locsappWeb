#!/bin/sh

cd /fixtures/locsapp-mongo-2016-02-22T17-18-30
mongorestore -d locsapp ./

cd ../
mongoimport --db locsapp --collection articles articles_import.json
