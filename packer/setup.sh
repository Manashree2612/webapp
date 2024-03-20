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
echo "Installing app dependencies"
echo "================================================================="

sudo unzip /tmp/webapp.zip -d /opt/csye6225/
(cd /opt/csye6225/ && sudo npm install && sudo npm ci)
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 755 /opt/csye6225/

echo "================================================================="
echo "Installing Ops agent"
echo "================================================================="
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
sudo mkdir -p /var/log/webapp

echo 'logging:
  receivers:
    my-app-receiver:
      type: files
      include_paths:
        - /var/log/webapp/csye6225.log
      record_log_file_path: true
  processors:
    my-app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S"
  service:
    pipelines:
      default_pipeline:
        receivers: [my-app-receiver]
        processors: [my-app-processor]' | sudo tee /etc/google-cloud-ops-agent/config.yaml > /dev/null
sudo systemctl restart google-cloud-ops-agent

echo "================================================================="
echo "Moving systemctl service"
echo "================================================================="
# Move systemd service unit file to the correct location
sudo mv /opt/csye6225/cloud.service /etc/systemd/system/cloud.service
sudo chown -R csye6225:csye6225 /var/log/webapp

# echo "=======================ALL DONE==================================="
