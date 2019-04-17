const dynamoGeo = require('dynamodb-geo');
const dynamoDb = require('./dynamoDb').DynamoDB;

const geoConf = new dynamoGeo.GeoDataManagerConfiguration(dynamoDb, process.env.DYNAMODB_TABLE_CHARGER_GEO);
geoConf.hashKeyLength = Number.parseFloat(process.env.GEOHASHLENGTH);

module.exports = new dynamoGeo.GeoDataManager(geoConf);
