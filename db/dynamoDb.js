const AWS = require('aws-sdk');

let options = {};
/* istanbul ignore next */
// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}
options.convertEmptyValues = true;
module.exports = new AWS.DynamoDB.DocumentClient(options);
module.exports.DynamoDB = new AWS.DynamoDB(options);
