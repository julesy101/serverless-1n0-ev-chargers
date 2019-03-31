const chargerRepository = require("../db/repository");
const responses = require("../utilities/responses");

module.exports.fetchCharger = async (event, context) => {
  if(!event.id)
    return responses.badRequest();

  let charger = await chargerRepository.getCharger(event.id);
  if(!charger)
    return responses.notFound();

  return responses.ok(charger);
};