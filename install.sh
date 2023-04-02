#!/bin/sh

docker-compose down
docker-compose stop
export PUBLIC_IP=$(curl https://ipinfo.io/ip ; echo)
docker-compose build
docker-compose up -d