#!/usr/bin/env bash

DOCKER_IMAGE_NAME="trello-nest-stack"

docker stack deploy -c docker-compose.yml $DOCKER_IMAGE_NAME
