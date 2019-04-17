const chargerRepository = require('../db/repository');
const modelValidator = require('../validation/validate');
const responses = require('../utilities/responses');

module.exports.updateCharger = async event => {
    if (!event.body) return responses.badRequest();

    const jsonPayload = event.body;

    if (jsonPayload) {
        const validateResult = modelValidator.validate(jsonPayload, 'updateChargerModel');
        if (!validateResult.valid) return responses.badRequest();

        return responses.ok(await chargerRepository.updateCharger(jsonPayload));
    }

    return responses.badRequest();
};
