const dynamoDb = require("./dynamoDb");
const uuid =  require('uuid');

class ChargerRepository {

    async openChargeMapLastModifiedDate(){
        let params = {
            TableName: process.env.DYNAMODB_TABLE
        };

        return null;
    }
    async getCharger(id){
        let params = {
            TableName: process.env.DYNAMODB_TABLE,
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

    async addCharger(charger){
        let timestamp = new Date().getTime();
        charger.id = uuid.v1();
        charger.created = timestamp;
        charger.updated = timestamp;

        let params =  {
            TableName: process.env.DYNAMODB_TABLE,
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
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                "id": charger.id
            }
        };

        return await dynamoDb.delete(params)
                             .promise();
    }
}

module.exports = new ChargerRepository();