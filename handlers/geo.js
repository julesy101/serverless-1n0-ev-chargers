const repository = require("../db/geoEnabledRepository");
const responses = require("../utilities/responses");

module.exports.geoLookup = async (event, context) => {
    let lat = Number.parseFloat(event.lat);
    let lng = Number.parseFloat(event.lng);
    let radius = 1000;
    if(event.radius)
        radius = Number.parseFloat(event.radius);

    let results = await repository.radiusSearch(lat, lng, radius)
    if(!results)
        responses.notFound();
        
    return responses.ok(results);
};