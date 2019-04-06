const ChargerRepository = require('./repository').ChargerRepository;
const dynamoGeo = require('dynamodb-geo');
const dynamoDb = require('./dynamoDb').DynamoDB;

class GeoEnabledChargerRepository extends ChargerRepository {
    constructor(){
        super();
        let geoConf = new dynamoGeo.GeoDataManagerConfiguration(dynamoDb, process.env.DYNAMODB_TABLE_CHARGER_GEO);
        geoConf.hashKeyLength = Number(process.env.GEOHASHLENGTH);
        this._geoManager = new dynamoGeo.GeoDataManager(geoConf);     
    }

    async addCharger(charger){  
        let savedCharger = await super.addCharger(charger)
        if(savedCharger){
            try{
                // create a geo compatible point
                let geoObj = {
                    RangeKeyValue: { S: savedCharger.id },
                    GeoPoint: {
                        latitude: savedCharger.address.latitude,
                        longitude: savedCharger.address.longitude
                    },
                    PutItemInput: {
                        Item: {
                            id: { S: savedCharger.id}
                        }
                    }
                };
                await this._geoManager.putPoint(geoObj).promise();
                return savedCharger;
            } catch(error){
                // we now have an inconsistent state where there is a charger in the main
                // table but not in our geohashed table, remove from the main table.
                await super.deleteCharger(savedCharger);
                throw new Error("failed to save to geo table")
            }
        }
    }

    async radiusSearch(lat, lng, radius){
        let records = await this._geoManager.queryRadius({
            RadiusInMeter: radius,
            CenterPoint: {
                latitude: lat,
                longitude: lng
            }
        });
        if(records && records.length > 0){
            let ids = records.map(x => x.id);
            return await super.getChargers(ids);
        }
        return;
    }
}

module.exports = new GeoEnabledChargerRepository();