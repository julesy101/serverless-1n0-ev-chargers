const modelValidator = require('../validation/validate');
const rp = require('../utilities/request-wrapper');
const Charger = require('../entities/charger');

class ChargerApiSdk {
    constructor(baseApi) {
        if (!baseApi || baseApi === '') this.baseUrl = process.env.APIBASEURL;
        else this.baseUrl = baseApi;
    }

    async getCharger(chargerId) {
        if (!chargerId || chargerId === '') throw new Error('charger id must be provided');

        return new Charger(await rp.get(`${this.baseUrl}/chargers/fetch/${chargerId}`));
    }

    async searchChargerByCoordinates(lat, lng, radius) {
        if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radius))
            throw new Error('lat, lng and radius must be numbers');

        if (radius < 1000) throw new Error('radius must be 1000m or more');

        const chargers = await rp.get(`${this.baseUrl}/chargers/geo/${lat}/${lng}/${radius}`);
        return chargers.map(x => new Charger(x));
    }

    async addCharger(charger) {
        const validationResult = modelValidator.validate(charger, 'addChargerModel');
        if (validationResult.valid) return new Charger(await rp.put(`${this.baseUrl}/chargers/add`, charger));
        throw new Error('invalid model');
    }

    async updateCharger(charger) {
        const validationResult = modelValidator.validate(charger, 'updateChargerModel');
        if (validationResult.valid) return new Charger(await rp.post(`${this.baseUrl}/chargers/update`, charger));
        throw new Error('invalid model');
    }

    async deleteCharger(chargerId) {
        if (!chargerId || chargerId === '') throw new Error('charger id must be provided');

        await rp.delete(`${this.baseUrl}/chargers/delete/${chargerId}`);
    }
}

module.exports = ChargerApiSdk;
module.exports.Charger = Charger;
