#!/bin/bash
set -eo pipefail
echo "" > docker/api.env
docker-compose -f docker/docker-compose.yml build terms-service
#docker images