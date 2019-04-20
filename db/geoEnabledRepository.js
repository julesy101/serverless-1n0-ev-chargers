const ChargerRepository = require('./repository');
const geoManager = require('./geoManagerConfig');

class GeoEnabledChargerRepository extends ChargerRepository {
    static async addCharger(charger) {
        const savedCharger = await super.addCharger(charger);
        if (savedCharger) {
            try {
                // create a geo compatible point
                const geoObj = {
                    RangeKeyValue: { S: savedCharger.id },
                    GeoPoint: {
                        latitude: savedCharger.address.latitude,
                        longitude: savedCharger.address.longitude
                    },
                    PutItemInput: {
                        Item: {
                            id: { S: savedCharger.id }
                        }
                    }
                };
                await geoManager.putPoint(geoObj).promise();
                return savedCharger;
            } catch (error) {
                // we now have an inconsistent state where there is a charger in the main
                // table but not in our geohashed table, remove from the main table.
                await super.deleteCharger(savedCharger);
                throw new Error('failed to save to geo table');
            }
        }
        return null;
    }

    static async radiusSearch(latitude, longitude, radius) {
        const lat = Number(latitude);
        const lng = Number(longitude);
        const rad = Number(radius);

        if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(rad))
            throw new Error('lat, lng & radius need to be numbers');

        const records = await geoManager.queryRadius({
            RadiusInMeter: rad,
            CenterPoint: {
                latitude: lat,
                longitude: lng
            }
        });
        if (records && records.length > 0) {
            const ids = records.map(x => x.id.S);
            const chargers = await super.getChargers(ids);
            return chargers;
        }

        return null;
    }
}

module.exports = GeoEnabledChargerRepository;
