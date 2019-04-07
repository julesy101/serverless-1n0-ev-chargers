const Charger = require("../charger")
const requestWrapper = require('../utilities/request-wrapper');
const debug = require('../utilities/logger').debug;
const chargerRepository = require("../db/geoEnabledRepository")
const ocmMapper = require("../charger").transformOcmEntity;
const ocmUrl = "https://api.openchargemap.io/v3/poi/?output=json";
const PromiseThrottle = require('promise-throttle');

module.exports.checkLatest = async(event) => {
    // get the most recent last modified open charge map charger
    let lmd = await chargerRepository.openChargeMapLastModifiedDate();
    let queryUrl = `${ocmUrl}&countrycode=${process.env.COUNTRY}&verbose=false&maxresults=${process.env.MAXRESULTS}`
    if(lmd){
        // if lmd is populated we will limit the
        // query to save unnecessary processing:
        // expected format: yyyy-mm-dd
        let lmdNative = new Date(lmd);
        lmdNative.setMinutes(lmdNative.getMinutes() + 1);
        queryUrl = `${queryUrl}&modifiedsince=${new Date(lmdNative).toISOString()}`
    }
    debug(`querying: ${queryUrl}`);
    // make the network call:
    let ocmChargers = JSON.parse(await requestWrapper.get(queryUrl));  
    if(ocmChargers){
        debug(`chargers found: processing ${ocmChargers.length} chargers`)
        let chargersToAdd = [];
        for(let i = 0; i < ocmChargers.length; i++){
            let ocmCharger = ocmChargers[i];
            if(ocmCharger === null)
                continue;
            
            let transformedOcmEntity = ocmMapper(ocmCharger);
            if(transformedOcmEntity === null)
                continue;
            
            chargersToAdd.push(new Charger(transformedOcmEntity));
        }
        if(chargersToAdd.length > 0) {
            // map update ids to a single dimension array to 
            // filter the update chargers from the adds:
            let updateCheck = chargersToAdd.map(x => chargerRepository.getOcmCharger(x.ocmId));
            let updateCheckResult = await Promise.all(updateCheck);
            let ocmMap = { };
            updateCheckResult = updateCheckResult.filter(x => x && x !== null).forEach(c => {
                ocmMap[c.ocmId] = c;
            });
            
            let promises = [];
            let pt = new PromiseThrottle({
                requestsPerSecond: 20,
                promiseImplementation: Promise  
            });
            chargersToAdd.forEach(charger => {
                if(ocmMap[charger.ocmId]){
                    charger.id = ocmMap[charger.ocmId].id;
                    charger.created = ocmMap[charger.ocmId].created;
                    charger.updated = ocmMap[charger.ocmId].updated;
                    promises.push(pt.add(() => chargerRepository.updateCharger(charger)));
                } else {
                    promises.push(pt.add(() => chargerRepository.addCharger(charger)));
                }
            });
            let result = await Promise.all(promises);
            if(result && result.length > 0) {
                let sorted = result.filter(x => x && x !== null ).sort((a,b) => new Date(a.ocm.dateLastStatusUpdate) - new Date(b.ocm.dateLastStatusUpdate));
                await chargerRepository.setOpenChargeMapLastModifiedDate(sorted[sorted.length - 1].ocm);
                debug(`${sorted.length} chargers processed`);
            }
        }
    }
}
