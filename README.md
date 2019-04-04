# 1and0 Serverless Charger Service
EV Charger Serverless Microservice utilising dynamodb and aws lambda.

## Installation
Usual npm installation
> **npm install**

Will need serverless at the global level
> **npm install -g serverless**

then install dynamodb, you will need Java in your path!

> **serverless dynamodb install**

now we migrate the tables, this goes through the json files in db/migrations and applies them to your local dynamo db
> **serverless dynamodb start --migrate**

