const uuid = require('uuid');
const dynamoDb = require('./dynamoDb');
const partioner = require('../utilities/arrayPartitioner');
const Charger = require('../entities/charger');

class ChargerRepository {
    static async openChargeMapLastModifiedDate() {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER_STATS,
            Key: {
                id: 'OCM-MOST-RECENT'
            }
        };
        const mostRecent = await dynamoDb.get(params).promise();
        if (mostRecent.Item) return mostRecent.Item.dateLastStatusUpdate;

        return null;
    }

    static async setOpenChargeMapLastModifiedDate(ocm) {
        const ocmLastModified = ocm;
        ocmLastModified.id = 'OCM-MOST-RECENT';
        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER_STATS,
            Item: ocmLastModified
        };

        await dynamoDb.put(params).promise();
    }

    static async getCharger(id) {
        if (!id || id === '') return null;

        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Key: {
                id
            }
        };

        const item = await dynamoDb.get(params).promise();
        if (item.Item) return new Charger(item.Item);

        return null;
    }

    static async getChargers(ids) {
        if (!ids || ids.length === 0) return [];

        const batchedGets = [];
        const partitionedIds = partioner(ids, 100);
        partitionedIds.forEach(partioned => {
            const keys = [];
            partioned.forEach(key => {
                keys.push({
                    id: key
                });
            });
            const requestItems = {};
            requestItems[process.env.DYNAMODB_TABLE_CHARGER] = {
                Keys: keys
            };
            const params = {
                RequestItems: requestItems
            };

            batchedGets.push(dynamoDb.batchGet(params).promise());
        });
        const result = await Promise.all(batchedGets);

        const all = result.map(x => x.Responses && x.Responses[process.env.DYNAMODB_TABLE_CHARGER]);
        const flat = [];
        all.forEach(x => x.forEach(z => flat.push(new Charger(z))));
        return flat;
    }

    static async getOcmCharger(ocmId) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            IndexName: 'OCMChargers',
            KeyConditionExpression: 'ocmId = :ocmId',
            ExpressionAttributeValues: {
                ':ocmId': ocmId
            }
        };

        const item = await dynamoDb.query(params).promise();
        if (item.Items && item.Items.length > 0) return new Charger(item.Items[0]);

        return null;
    }

    static async addCharger(addChargerModel) {
        const charger = addChargerModel;
        const timestamp = new Date().getTime();
        charger.id = uuid.v4();
        charger.created = timestamp;
        charger.updated = timestamp;

        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Item: charger
        };

        await dynamoDb.put(params).promise();

        return new Charger(charger);
    }

    static async updateCharger(updateChargerModel) {
        if (!updateChargerModel.id || updateChargerModel.id === '')
            throw new Error('id must be provided to update charger');
        const charger = updateChargerModel;
        charger.updated = new Date().getTime();

        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Item: charger
        };

        await dynamoDb.put(params).promise();

        return new Charger(charger);
    }

    static async deleteCharger(charger) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_CHARGER,
            Key: {
                id: charger.id
            }
        };

        await dynamoDb.delete(params).promise();
    }
}

module.exports = ChargerRepository;
