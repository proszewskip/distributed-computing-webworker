#!/bin/sh

backendContainter=$(docker ps | grep backend | cut -d' ' -f1)
postgresContainer=$(docker ps | grep postgres | cut -d' ' -f1)

#DB backup
docker exec -t $postgresContainer pg_dumpall -c -U postgres > db_backup.sql

#Task definitions backup
docker exec -t $backendContainter tar -zcvf task-definitions.tar.gz /task-definitions/ /compiled-task-definitions/;
docker cp $backendContainter:/app/task-definitions.tar.gz task-definitions.tar.gz

#Compress both backups
tar -zcvf backup_`date +%d-%m-%Y"_"%H_%M_%S`.tar.gz task-definitions.tar.gz db_backup.sql

#Cleanup 
rm db_backup.sql task-definitions.tar.gz
docker exec -t $backendContainter rm task-definitions.tar.gz
