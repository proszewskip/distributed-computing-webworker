#!/bin/sh

docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Save built images  
docker save distributed-computing-webworker_backend  -o backend_docker.tar
docker save distributed-computing-webworker_frontend -o frontend_docker.tar

# Compress created images
tar -czf docker_images.tar.gz backend_docker.tar frontend_docker.tar


# Cleanup
rm backend_docker.tar frontend_docker.tar


