const chargerRepository = require('../db/geoEnabledRepository');
const modelValidator = require('../validation/validate');
const responses = require('../utilities/responses');

module.exports.addCharger = async event => {
    if (!event.body) {
        return responses.badRequest();
    }

    const jsonPayload = event.body;
    const validateResult = modelValidator.validate(jsonPayload, 'addChargerModel');
    if (!validateResult.valid) return responses.badRequest();

    return responses.ok(await chargerRepository.addCharger(jsonPayload));
};
