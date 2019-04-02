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
            return mostRecent.Item.dateCreated;
        
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
            Key: {
                "ocmId":  id 
            } 
        }

        let item = await dynamoDb.get(params).promise();
        if(item.Item)
            return item.Item;
        
            return null;
    }

    async addCharger(charger){
        let timestamp = new Date().getTime();
        charger.id = uuid.v1();
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

    updateCharger(charger) {

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