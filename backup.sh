#!/bin/sh


#DB backup
docker exec -t $(docker ps | grep postgres | cut -d' ' -f1) pg_dumpall -c -U postgres > db_backup.sql

#Task definitions backup
docker exec -t $(docker ps | grep backend | cut -d' ' -f1) tar -zcvf task-definitions.tar.gz /task-definitions/ /compiled-task-definitions/;
docker cp $(docker ps | grep backend | cut -d' ' -f1):/app/backup.tar.gz task-definitions.tar.gz

#Compress both backups
tar -zcvf backup_`date +%d-%m-%Y"_"%H_%M_%S`.tar.gz task-definitions.tar.gz db_backup.sql

#Cleanup 
rm db_backup.sql task-definitions.tar.gz
docker exec -t $(docker ps | grep backend | cut -d' ' -f1) rm task-definitions.tar.gz

