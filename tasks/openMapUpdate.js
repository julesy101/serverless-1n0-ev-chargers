const Charger = require("../charger")
const rp = require('request-promise-native');
const chargerRepository = require("../db/repository")
const ocmUrl = "https://api.openchargemap.io/v3/poi/?output=json";

module.exports.checkLatest = async(event) => {
    console.log("Open Charge Map Auto Updater");
    console.log(event);

    // get the most recent last modified open charge map charger
    let lmd = await chargerRepository.openChargeMapLastModifiedDate();
    let queryUrl = `${ocmUrl}&countrycode=${process.env.COUNTRY}&verbose=false&maxresults=${process.env.MAXRESULTS}`
    if(lmd){
        // if lmd is populated we will limit the
        // query to save unnecessary processing:
        // expected format: yyyy-mm-dd
        queryUrl = `${queryUrl}&modifiedsince=${new Date(lmd).toISOString()}`
    }
    console.log(`querying: ${queryUrl}`);
    // make the network call:
    let ocmChargers = JSON.parse(await rp(queryUrl));  
    if(ocmChargers){
        console.log(`chargers found: processing ${ocmChargers.length} chargers`)
        let chargersToAdd = [];
        for(let i = 0; i < ocmChargers.length; i++){
            let ocmCharger = ocmChargers[i];
            let connections = [];
            if(!ocmCharger.ID)
                continue;

            for(let x = 0; x < ocmCharger.Connections.length; x++){
                if(ocmCharger.Connections[x].CurrentType && ocmCharger.Connections[x].ConnectionType){
                    connections.push({
                        type: ocmCharger.Connections[x].ConnectionType.Title,                    
                        kw: ocmCharger.Connections[x].PowerKW,
                        currentType: ocmCharger.Connections[x].CurrentType.Title
                    });
                }
            }
            let network = null;
            if(ocmCharger.OperatorInfo){
                network = {
                    websiteURL: ocmCharger.OperatorInfo.WebsiteURL,
                    isPrivateIndividual: ocmCharger.OperatorInfo.IsPrivateIndividual,     
                    contactEmail: ocmCharger.OperatorInfo.ContactEmail,              
                    title: ocmCharger.OperatorInfo.Title
                };
            } else {
                continue;
            }
            let charger = new Charger({
                ocmId: ocmCharger.ID,
                connections: connections,
                network: network,
                address: {
                    title: ocmCharger.AddressInfo.Title,
                    addressLine1: ocmCharger.AddressInfo.AddressLine1,
                    addressLine2: ocmCharger.AddressInfo.AddressLine2,
                    town: ocmCharger.AddressInfo.Town,
                    stateOrProvince: ocmCharger.AddressInfo.StateOrProvince,
                    postcode: ocmCharger.AddressInfo.Postcode,
                    country: ocmCharger.AddressInfo.Country.ISOCode,                    
                    latitude: ocmCharger.AddressInfo.Latitude,
                    longitude: ocmCharger.AddressInfo.Longitude,
                },
                ocm: {
                    id: ocmCharger.ID,
                    uuid: ocmCharger.UUID,
                    dateCreated: ocmCharger.DateCreated,
                    dateLastStatusUpdate: ocmCharger.DateLastStatusUpdate
                }
            });

            chargersToAdd.push(charger);
        }
        if(chargersToAdd.length > 0) {
            // map update ids to a single dimension array to 
            // filter the update chargers from the adds:
            let updateCheck = chargersToAdd.map(x => chargerRepository.getOcmCharger(x.ocmId));
            let updateCheckResult = await Promise.all(updateCheck);
                        
            updateCheckResult = updateCheckResult.filter(x => x && x !== null);
            let updateIds = updateCheckResult.map(x => x.ocmId);
            // filter the updates from the adds:
            let chargersToUpdate = chargersToAdd.filter(x => updateIds.includes(x.ocmId));
            chargersToUpdate.forEach((c, idx) => {
                c.id = updateCheckResult[idx].id;
                c.created = updateCheckResult[idx].created;
                c.updated = updateCheckResult[idx].updated;
            });
            chargersToUpdate = chargersToUpdate.map(x => chargerRepository.updateCharger(x));
            chargersToAdd = chargersToAdd.filter(x => !updateIds.includes(x.ocmId))
                                         .map(x => chargerRepository.addCharger(x));
            console.log(`add: ${chargersToAdd.length} update: ${chargersToUpdate.length}`);
            
            // get the results of the update:
            let resultsForAdd = await Promise.all(chargersToAdd);
            let resultsForUpdate = await Promise.all(chargersToUpdate);
            // now lets see what the most recent status update we added was:
            let highestAdd = resultsForAdd.sort((a,b) => new Date(a.ocm.dateLastStatusUpdate) - new Date(b.ocm.dateLastStatusUpdate))[resultsForAdd.length - 1];
            let highestUpdate = resultsForUpdate.sort((a,b) => new Date(a.ocm.dateLastStatusUpdate) - new Date(b.ocm.dateLastStatusUpdate))[resultsForUpdate.length - 1];
            
            if(!highestAdd && highestUpdate)
                await chargerRepository.setOpenChargeMapLastModifiedDate(highestUpdate.ocm)
            else if (!highestUpdate && highestAdd)
                await chargerRepository.setOpenChargeMapLastModifiedDate(highestAdd.ocm)
            else if(highestAdd && highestUpdate && Date(highestAdd.dateLastStatusUpdate) > new Date(highestUpdate.dateLastStatusUpdate))
                await chargerRepository.setOpenChargeMapLastModifiedDate(highestAdd.ocm)
            else
                await chargerRepository.setOpenChargeMapLastModifiedDate(highestUpdate.ocm)

            console.log(`${chargersToAdd.length + chargersToUpdate.length} chargers processed`);
        }
    }
}
