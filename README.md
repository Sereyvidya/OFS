CS 160 Group 3 Spring 2025

# OFS delivery service Installation Guide

First step is to download the files project files

Within the project folder, on the same level as backend and database, create a file called ".env" and paste the following:
```
#backend vars
STRIPE_SECRET_KEY= # secret key from stripe
MAPBOX_TOKEN= 

#frontend vars
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # publishable key from Stripe
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

You will need to create an account for both Stripe and MapBox and paste your keys in the appropriate places in the .env file

## Stripe account:
https://dashboard.stripe.com/login

Sign up with Google and skip until you get to this screen
![image](https://github.com/user-attachments/assets/d48fae41-7b14-412b-acc2-6002e32a0c09)
Click on the developers tab and click on API keys
![image](https://github.com/user-attachments/assets/b425d5e9-351e-49a5-9031-95f15888e692)

## MapBox account:
https://account.mapbox.com/auth/signup/

Create an individual account for MapBox and verify your email address
it will then ask for a mailing address and continue

The key for MapBox will be at the top of the account overview page under Tokens
Use this key for both MapBox Token fields in .env

## Locally Host the website

The next step is to download the Docker Desktop app from https://www.docker.com/products/docker-desktop/ 

Make sure to select the download that matches your system.


Once Docker is downloaded and installed, it will ask you to restart your computer. 
Build the Docker image by running the following command:
```
docker-compose up -d --build
```
It may take a few seconds.

After that, then you will seed the database by running:
```
docker-compose run --rm seed_database
```
This step will require you to have your .env file set up as previously specified

### Potential Errors:

One error you may run into is that you may already have a MySQL server running on port 3306

This issue is resolved on Windows by right-clicking Windows PowerShell and selecting "Run as administrator" then running:
```
net stop MySQL80
```
You may have to stop a different program if it is something else using port 3306.



## Access OFS website
from your preferred internet browser go to http://localhost:3000/home for the main site

to access the admin page go to http://localhost:3000/admin and log in with the following credentials:

Username: alice.smith@ofs.com

Password: Password123$



