const dynamoDb = require("./dynamoDb");
const uuid =  require('uuid');
const partioner = require('../utilities/arrayPartitioner');
const Charger = require('../entities/charger');

class ChargerRepository {
    constructor(){
        this._mostRecentStatId = "OCM-MOST-RECENT"
    }
    async openChargeMapLastModifiedDate(){
        let params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER_STATS,
            Key: {
                "id":  this._mostRecentStatId 
            }
        };
        let mostRecent = await dynamoDb.get(params)
                                       .promise();
        if(mostRecent.Item)
            return mostRecent.Item.dateLastStatusUpdate;
        
        return null;
    }
    
    async setOpenChargeMapLastModifiedDate(ocmLastModified){
        ocmLastModified.id = this._mostRecentStatId;
        let params =  {
            TableName: process.env.DYNAMODB_TABLE_CHARGER_STATS,
            Item: ocmLastModified
        }

        await dynamoDb.put(params)
                      .promise();
    }

    async getCharger(id){
        if(!id || id === "")
            return;

        let params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Key: {
                "id":  id 
            }
        }

        let item = await dynamoDb.get(params)
                                 .promise();
        if(item.Item)
            return new Charger(item.Item);
        
        return;
    }

    async getChargers(ids) {
        if(!ids || ids.length === 0)
        return [];
    
        let batchedGets = [];
        let partitionedIds = partioner(ids, 100);
        partitionedIds.forEach((partioned) => {
            let keys = [];
            partioned.forEach(key => {
                keys.push({
                    "id": key
                });
            });
            let requestItems = {};
            requestItems[process.env.DYNAMODB_TABLE_CHARGER] = {
                Keys: keys
            };
            let params = {
                RequestItems: requestItems
            }

            batchedGets.push(dynamoDb.batchGet(params).promise());
        });
        let result = await Promise.all(batchedGets);

        let all = result.map(x => x.Responses && x.Responses[process.env.DYNAMODB_TABLE_CHARGER]);
        let flat = [];
        all.forEach(x => x.forEach(z => flat.push(new Charger(z))));
        return flat;
    }

    async getOcmCharger(ocmId){
        let params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            IndexName: "OCMChargers",
            KeyConditionExpression: "ocmId = :ocmId",
            ExpressionAttributeValues: {
                ":ocmId": ocmId
            }
        }

        let item = await dynamoDb.query(params).promise();
        if(item.Items && item.Items.length > 0)
            return new Charger(item.Items[0]);
        
            return null;
    }

    async addCharger(charger){
        let timestamp = new Date().getTime();
        charger.id = uuid.v4();
        charger.created = timestamp;
        charger.updated = timestamp;

        let params =  {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Item: charger
        }

        await dynamoDb.put(params)
                      .promise();

        return new Charger(charger);
    }

    async updateCharger(charger) {
        if(!charger.id || charger.id === "")
            throw new Error("id must be provided to update charger");

        let timestamp = new Date().getTime();
        charger.updated = timestamp;

        let params =  {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Item: charger
        }

        await dynamoDb.put(params)
                      .promise();

        return new Charger(charger);
    }

    async deleteCharger(charger){
        let params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Key: {
                "id": charger.id
            }
        };

        return await dynamoDb.delete(params)
                             .promise();
    }

}

module.exports = new ChargerRepository();
module.exports.ChargerRepository = ChargerRepository;