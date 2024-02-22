# webapp

## Overview
This project implements a set of APIs for user management, providing functionalities such as creating a new user, updating user information, and retrieving user details. 

## Authentication
The web application supports Token-Based Basic authentication. Users are required to provide a basic authentication token when making API calls to authenticated endpoints.

## Create a New User
Users can create an account by providing the following information:
- Email Address
- Password
- First Name
- Last Name

## Update User Information
Users can update their account information, including:
- First Name
- Last Name
- Password
  

Attempting to update any other field results in a 400 Bad Request HTTP response code. Upon successful update, the `account_updated` field for the user is updated. Users can only update their own account information.

## Get User Information
Users can retrieve their account information, with the response payload containing all fields except for the password.

## Continuous Integration (CI) with GitHub Actions

The project includes a GitHub Actions workflow to run a simple check (compile code) for each pull request raised. A pull request can only be merged if the workflow executes successfully. Additionally, Status Checks GitHub branch protection is enabled to prevent users from merging a pull request when the GitHub Actions workflow run fails.


## Installation
npm install
nodemon server.js
