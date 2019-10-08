#!/bin/sh
tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./build/*
# TODO: Add other parameters to this command so we can automate the deployment
caprover deploy -t ./deploy.tar
rm deploy.tar
