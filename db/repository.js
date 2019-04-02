const dynamoDb = require("./dynamoDb");
const uuid =  require('uuid');

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
        let params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Key: {
                "id":  id 
            }
        }

        let item = await dynamoDb.get(params)
                                 .promise();
        if(item.Item)
            return item.Item;
        
        return;
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
            return item.Items[0];
        
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

        return charger;
    }

    async updateCharger(charger) {
        if(!charger.id && charger.id !== "")
            throw new Error("id must be provided to update charger");

        let timestamp = new Date().getTime();
        charger.updated = timestamp;

        let params =  {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Item: charger
        }

        await dynamoDb.put(params)
                      .promise();

        return charger;
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