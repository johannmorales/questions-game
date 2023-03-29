#!/bin/sh

docker-compose down
PUBLIC_IP=$(curl https://ipinfo.io/ip ; echo)
docker-compose up -d