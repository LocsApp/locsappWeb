#!/bin/sh

echo "Removing the previous documentation..."
rm -rf ./templates/api_doc/*

echo "Generating the new documentation..."
apidoc -i ./API -o ./templates/api_doc -c ./apidoc_jsons/models/

#apidoc -i ./oauth/controllers -o ./public/doc_auth/api_doc -c ./apidoc_jsons/auth/

echo "Done."
