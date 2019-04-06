const chargerRepository = require("../db/repository");
const responses = require("../utilities/responses");

module.exports.searchChargers = async (event, context) => {
  if(!event.query)
    return responses.badRequest();

  
  

  return responses.ok();
};