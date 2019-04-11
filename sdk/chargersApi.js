const modelValidator = require("../validation/validate");
const rp = require('../utilities/request-wrapper');

class ChargerApiSdk {
    constructor(baseApi){
        if(!baseApi || baseApi === '')
            this.baseUrl = process.env.APIBASEURL;
        else
            this.baseUrl = baseApi;
    }

    async addCharger(charger){
        let validationResult = modelValidator.validate(charger, "addChargerModel");
        if(validationResult.valid)
            return await rp.put(`${this.baseUrl}/chargers/add`, charger);
        else
            throw new Error("invalid model");
    }


}

module.exports = ChargerApiSdk;