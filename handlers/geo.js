const repository = require('../db/geoEnabledRepository');
const responses = require('../utilities/responses');

module.exports.geoLookup = async event => {
    const lat = Number(event.lat);
    const lng = Number(event.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return responses.badRequest();

    let radius = 1000;
    if (event.radius) radius = Number(event.radius);

    const results = await repository.radiusSearch(lat, lng, radius);
    if (!results || results.length === 0) responses.notFound();

    return responses.ok(results);
};
