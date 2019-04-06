const repository = require("../db/geoEnabledRepository");
const responses = require("../utilities/responses");

module.exports.geoLookup = async (event, context) => {
    if(!event.lat || !event.lng)
        return responses.badRequest();

    let radius = 1000;
    if(event.radius)
        radius = event.radius;
    let results = await repository.radiusSearch(event.lat, event.lng, radius)
    if(!results)
        responses.notFound();
    
    return responses.ok(results);
};