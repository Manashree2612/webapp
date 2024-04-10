#!/bin/bash

# Create the .env file with the specified content
echo "DEV_USERNAME=${mysql_user}
DEV_PASSWORD=${mysql_password}
DEV_DATABASE=${mysql_database}
DEV_HOST=${mysql_host}
DEV_DIALECT=mysql
PORT=8080
NODE_ENV=production" > /tmp/.env

sudo mv /tmp/.env /opt/csye6225/.env

sudo systemctl daemon-reload
sudo systemctl enable cloud.service
sudo systemctl start cloud.service