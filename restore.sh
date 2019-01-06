#!/bin/sh

#Unpack archive
mkdir backup
tar -xzf $1 -C backup

#Restore DB
cat backup/db_backup.sql | docker exec -i $(docker ps | grep postgres | cut -d' ' -f1) psql -U postgres

#Restore task definitions
docker cp backup/task-definitions.tar.gz $(docker ps | grep backend | cut -d' ' -f1):/
docker exec -t $(docker ps | grep backend | cut -d' ' -f1) tar -xzf /task-definitions.tar.gz -C /
docker exec -t $(docker ps | grep backend | cut -d' ' -f1) rm /task-definitions.tar.gz

rm backup -rf


