#!/bin/sh

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --no-start

# Save built images  
docker save distributed-computing-webworker_backend  -o backend_docker.tar
docker save distributed-computing-webworker_frontend -o frontend_docker.tar
docker save postgres -o postgres_docker.tar
docker save nginx -o nginx_docker.tar

# Compress created images
tar -czf docker_images.tar.gz backend_docker.tar frontend_docker.tar postgres_docker.tar nginx_docker.tar


# Cleanup
rm backend_docker.tar frontend_docker.tar postgres_docker.tar nginx_docker.tar


