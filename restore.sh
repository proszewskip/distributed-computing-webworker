#!/bin/sh
 
backendContainer=$(docker ps | grep backend | cut -d' ' -f1)
postgresContainer=$(docker ps | grep postgres | cut -d' ' -f1)

#Unpack archive
mkdir backup
tar -xzf $1 -C backup

#Restore DB
cat backup/db_backup.sql | docker exec -i $postgresContainer psql -U postgres

#Restore task definitions
docker cp backup/task-definitions.tar.gz $backendContainer:/
docker exec -t $backendContainer tar -xzf /task-definitions.tar.gz -C /
docker exec -t $backendContainer rm /task-definitions.tar.gz

#Cleanup
rm backup -rf


