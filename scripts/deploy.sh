#!/usr/bin/env bash

docker-compose stop
docker-compose rm -f
docker system prune -f
docker-compose pull
docker-compose up -d