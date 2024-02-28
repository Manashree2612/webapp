#!/bin/bash
echo "================================================================="
echo "Adding user and group"
echo "================================================================="
sudo groupadd csye6225
sudo useradd --shell /usr/sbin/nologin -M -g csye6225 csye6225

echo "================================================================="
echo "Updating packages"
echo "================================================================="
sudo yum update -y

echo "================================================================="
echo "Installing zip packages"
echo "================================================================="

sudo yum install zip unzip -y

echo "================================================================="
echo "Installing Node and npm"
echo "================================================================="
curl --silent --location https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum -y install nodejs

# Check if npm is not installed before installing it
if ! command -v npm &> /dev/null
then
    # Install npm
    sudo yum install -y npm
fi

echo "================================================================="
echo "Installing app dependenciess"
echo "================================================================="

sudo unzip /tmp/webapp.zip -d /opt/csye6225/
(cd /opt/csye6225/ && sudo npm install && sudo npm ci)
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod 750 /opt/csye6225/

echo "================================================================="
echo "Moving systemctl service"
echo "================================================================="
# Move systemd service unit file to the correct location
sudo mv /opt/csye6225/cloud.service /etc/systemd/system/cloud.service

# echo "=======================ALL DONE==================================="
