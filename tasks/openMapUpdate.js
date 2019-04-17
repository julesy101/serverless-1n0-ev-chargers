const PromiseThrottle = require('promise-throttle');
const Charger = require('../entities/charger');
const requestWrapper = require('../utilities/request-wrapper');
const debug = require('../utilities/logger').debug;
const chargerRepository = require('../db/geoEnabledRepository');
const ocmMapper = require('../entities/charger').transformOcmEntity;

const ocmUrl = 'https://api.openchargemap.io/v3/poi/?output=json';

module.exports.checkLatest = async () => {
    // get the most recent last modified open charge map charger
    const lmd = await chargerRepository.openChargeMapLastModifiedDate();
    let queryUrl = `${ocmUrl}&countrycode=${process.env.COUNTRY}&verbose=false&maxresults=${process.env.MAXRESULTS}`;
    if (lmd) {
        // if lmd is populated we will limit the
        // query to save unnecessary processing:
        // expected format: yyyy-mm-dd
        const lmdNative = new Date(lmd);
        lmdNative.setMinutes(lmdNative.getMinutes() + 1);
        queryUrl = `${queryUrl}&modifiedsince=${new Date(lmdNative).toISOString()}`;
    }
    debug(`querying: ${queryUrl}`);
    // make the network call:
    const ocmChargers = JSON.parse(await requestWrapper.get(queryUrl));
    if (ocmChargers) {
        debug(`chargers found: processing ${ocmChargers.length} chargers`);
        const chargersToAdd = [];
        ocmChargers.forEach(ocmCharger => {
            if (ocmCharger === null) return;

            const transformedOcmEntity = ocmMapper(ocmCharger);
            if (transformedOcmEntity === null) return;

            chargersToAdd.push(new Charger(transformedOcmEntity));
        });
        if (chargersToAdd.length > 0) {
            // map update ids to a single dimension array to
            // filter the update chargers from the adds:
            const updateCheck = chargersToAdd.map(x => chargerRepository.getOcmCharger(x.ocmId));
            const ocmMap = {};
            (await Promise.all(updateCheck))
                .filter(x => x && x !== null)
                .forEach(c => {
                    ocmMap[c.ocmId] = c;
                });

            const promises = [];
            const pt = new PromiseThrottle({
                requestsPerSecond: 20,
                promiseImplementation: Promise
            });
            chargersToAdd.forEach(ac => {
                if (ocmMap[ac.ocmId]) {
                    const charger = ac;
                    charger.id = ocmMap[charger.ocmId].id;
                    charger.created = ocmMap[charger.ocmId].created;
                    charger.updated = ocmMap[charger.ocmId].updated;
                    promises.push(pt.add(() => chargerRepository.updateCharger(charger)));
                } else {
                    promises.push(pt.add(() => chargerRepository.addCharger(ac)));
                }
            });
            const result = await Promise.all(promises);
            if (result && result.length > 0) {
                const sorted = result
                    .filter(x => x && x !== null)
                    .sort((a, b) => new Date(a.ocm.dateLastStatusUpdate) - new Date(b.ocm.dateLastStatusUpdate));
                await chargerRepository.setOpenChargeMapLastModifiedDate(sorted[sorted.length - 1].ocm);
                debug(`${sorted.length} chargers processed`);
            }
        }
    }
};
