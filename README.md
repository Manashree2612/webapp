# Cloud - Native app

This project is a web application that implements a set of APIs for user management, providing functionalities such as creating a new user, updating user information, and retrieving user details.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Introduction

This project leverages Google Cloud Platform (GCP) services to build a robust and scalable application. Key features include:

- **API & Business Logic:** Developed RESTful API endpoints in Node.js for user requests, health checks, email verfication.
  
- **Testing & Image Building:** Implemented integration tests with Mocha and Jest. Built custom machine images using HashiCorp Packer for consistent deployments.
  
- **Infrastructure & Networking:** Provisioned VPC, Compute Engine instances, Cloud SQL, and established VPC peering. Configured Cloud DNS for domain management.
  
- **Monitoring & Observability:** Configured Ops Agent for centralized logging and structured JSON log collection.
  
- **Serverless Integration:** Utilized serverless functions triggered by Pub/Sub messages for tasks like sending verification emails with Mailgun. Set up a private VPC connector for secure connections.
  
- **Scalability & Security:** Launched managed instance groups with auto-scaling. Employed customer-managed encryption keys for data security.
  
- **CI/CD Pipeline:** Utilized GitHub Actions for integration tests, custom Packer image builds, and automated deployments.

This project demonstrates a comprehensive approach to building and deploying scalable, secure applications on GCP.


## Features

- **User Creation:** Users can create an account by providing their email address, password, first name, and last name.
- **User Update:** Users can update their account information, including their first name, last name, and password.
- **User Retrieval:** Users can retrieve their account information, excluding the password.
- **Token-Based Authentication:** Supports Token-Based Basic authentication for secure API access.

## Technologies Used

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **MySQL:** SQL database management system.
- **GitHub Actions:** CI/CD workflow automation.
- **Mocha:** JavaScript testing framework.
- **Packer:** Automated machine image creation.
- **Terraform:** Infrastructure as code on GCP.
- **GCP:** Cloud platform.

## System Architecture Diagram

![diagram-export-5-3-2024-3_06_04-PM](https://github.com/Manashree2612/webapp/assets/60699342/db646a0a-739f-4607-9cc7-3dc2103d3e86)


## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** [Download and install Node.js](https://nodejs.org/).
- **Docker:** [Download and install Docker](https://www.docker.com/get-started).
- **Git:** [Download and install Git](https://git-scm.com/downloads).
- **Terraform:** [Download and install Terraform](https://www.terraform.io/downloads.html).
- **Google Cloud SDK (gcloud CLI):** [Install the Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
- **Postman:** [Download and install Postman](https://www.postman.com/downloads/).
- **MySQL:** [Download and install MySQL](https://www.mysql.com/downloads/).
- **MySQL Workbench:** [Download and install MySQL Workbench](https://dev.mysql.com/downloads/workbench/).


### webapp
> To run locally
  - clone the repo 
  - create a .env file with following varibles
  ```
    DEV_USERNAME=___
    DEV_PASSWORD=___
    DEV_DATABASE=___
    DEV_HOST=127.0.0.1
    DEV_DIALECT=mysql
    PORT=8080
  ```
```bash
npm install
npm start
```
- To run workflow, first setup github secrets


### tf-infra
- clone the repo and run following commands to create the resources on gcp
- create a dev.tfvars file for all variables with relevant values
```bash
terraform init
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars
