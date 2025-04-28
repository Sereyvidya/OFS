CS 160 Group 3 Spring 2025
OFS delivery service 

## USER GUIDE

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

### Stripe account:
https://dashboard.stripe.com/login

sign up with google and skip until you get to this screen
![image](https://github.com/user-attachments/assets/d48fae41-7b14-412b-acc2-6002e32a0c09)
click on the developers tab and click on API keys
![image](https://github.com/user-attachments/assets/b425d5e9-351e-49a5-9031-95f15888e692)

### MapBox account:
https://account.mapbox.com/auth/signup/

create an individual account for MapBox and verify your email address
it will then ask for a mailing address and continue

The key for MapBox will be at the top of the account overview page under Tokens
Use this key for both MapBox Token fields in .env




