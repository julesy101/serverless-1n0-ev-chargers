const AWS = require('aws-sdk');

let options = {};
// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}
options.paramValidation = false;
module.exports = new AWS.DynamoDB.DocumentClient(options);