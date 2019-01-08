#!/bin/sh

# Extract docker images
mkdir docker_images
tar -xzf docker_images.tar.gz -C docker_images

# Import docker images
docker load --input docker_images/frontend_docker.tar
docker load --input docker_images/backend_docker.tar
docker load --input docker_images/postgres_docker.tar
docker load --input docker_images/nginx_docker.tar

# Cleanup
rm docker_images -rf