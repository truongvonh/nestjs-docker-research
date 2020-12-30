#!/usr/bin/env bash

DOCKER_IMAGE_NAME="truongvn/trello-nestjs"
DOCKER_IMAGE_VER="latest"

docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VER --target production .

docker image prune -f

docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_VER