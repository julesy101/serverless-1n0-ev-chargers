# 1and0 Serverless Charger Service
EV Charger Serverless Microservice utilising DynamoDB and AWS Lambda.

## Prerequisites
* An AWS Account 
* Node 8.10.0 or higher.

## Installation
1. Install the project's NPM dependencies. 
```bash
  npm install
```

2. Install the Serverless Framework globally.
```bash
  npm install -g serverless
```

3. The Serverless Framework needs access to your AWS account so that it can create and manage resources on your behalf. Set-up your AWS [Provider Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md) to enable this.

4. Now install DynamoDB into the project directory, you will need Java in your path.
```bash
  serverless dynamodb install
```
5. Migrate the database tables, this goes through the json files in `db/migrations` and applies them to your local DynamoDB.
 ```bash
   serverless dynamodb start --migrate
```

## Deployments
1. Deploy a Service
  
  Use this when you have made changes to your Functions, Events or Resources in `serverless.yml` or you simply want to deploy all changes within your Service at the same time.
  ```bash
  serverless deploy -v
  ```

2. Deploy the Function

  You can upload and overwrite specific AWS Lambda code on AWS by adding it to the deploy command.
  ```bash
  serverless deploy function -f someFunction
  ```

## Additional Information
You can find detailed instructions on the Serverless Framework in their own [documentation](https://serverless.com/framework/docs/providers/aws/)
