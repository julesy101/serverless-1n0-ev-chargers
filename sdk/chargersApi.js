const modelValidator = require("../validation/validate");
const rp = require('../utilities/request-wrapper');
const Charger = require("../entities/charger");

class ChargerApiSdk {
    constructor(baseApi) {
        if(!baseApi || baseApi === '')
            this.baseUrl = process.env.APIBASEURL;
        else
            this.baseUrl = baseApi;
    }

    async getCharger(chargerId){
        if(!chargerId || chargerId === '')
            throw new Error("charger id must be provided");
        
        return this._buildChargerFromResponse(await rp.get(`${this.baseUrl}/chargers/fetch/${chargerId}`));
    }

    async searchChargerByCoordinates(lat, lng, radius){
        if(isNaN(lat) || isNaN(lng) || isNaN(radius))
            throw new Error("lat, lng and radius must be numbers")

        if(radius < 1000)
            throw new Error("radius must be 1000m or more");
        
        let chargers = await rp.get(`${this.baseUrl}/chargers/geo/${lat}/${lng}/${radius}`);
        return chargers.map(x => this._buildChargerFromResponse(x));
    }
    
    async addCharger(charger) {
        let validationResult = modelValidator.validate(charger, "addChargerModel");
        if(validationResult.valid)
            return this._buildChargerFromResponse(await rp.put(`${this.baseUrl}/chargers/add`, charger));
        else
            throw new Error("invalid model");
    }

    async updateCharger(charger) {
        let validationResult = modelValidator.validate(charger, "updateChargerModel");
        if(validationResult.valid)
            return this._buildChargerFromResponse(await rp.post(`${this.baseUrl}/chargers/update`, charger));
        else 
            throw new Error("invalid model");
    }

    async deleteCharger(chargerId){
        if(!chargerId || chargerId === '')
            throw new Error("charger id must be provided");
        
        return await rp.delete(`${this.baseUrl}/chargers/delete/${chargerId}`);
    }

    _buildChargerFromResponse(charger){
        return new Charger(charger);   
    }
}

module.exports = ChargerApiSdk;