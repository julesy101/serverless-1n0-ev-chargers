const responseMocks = require('./ocmResponseMocks');
const Charger = require("../../charger")
const ocmMapper = require("../../charger").transformOcmEntity;

class MockRepositoryResults {
    ocmChargers(idToInclude) {
        let finals = [];
        let chargers = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z));
        for(let i = 0; i < chargers.length; i++){
            if(chargers[i]){
                if(idToInclude === chargers[i].ocmId){
                    chargers.id = "charger-id-" + i;
                    chargers.created = new Date().getTime();
                    chargers.updated = new Date().getTime();

                    return chargers[i];
                }
            }
        }

        return null;
    }

    chargerAdd(charger) {
        charger.id = "some-random-id-" + new Date().getTime(); 
        charger.created = new Date().getTime();
        charger.updated = new Date().getTime();
        
        return Promise.resolve(charger);
    }

    updateCharger(charger) {
        charger.updated = new Date().getTime();
        
        return Promise.resolve(charger);
    }
}

module.exports = new MockRepositoryResults();