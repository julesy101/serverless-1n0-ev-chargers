const chargerRepository = require('../db/geoEnabledRepository');
const responses = require('../utilities/responses');

module.exports.deleteCharger = async event => {
    if (!event.id || event.id === '') return responses.badRequest();

    await chargerRepository.deleteCharger(event.id);

    return responses.badRequest();
};
