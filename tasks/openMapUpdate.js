const Charger = require("../charger")
const rp = require('request-promise-native');
const chargerRepository = require("../db/repository")
const ocmUrl = "https://api.openchargemap.io/v3/poi/?output=json";

module.exports.checkLatest = async(event) => {
    console.log("Open Charge Map Auto Updater");
    console.log(event);

    // get the most recent last modified open charge map charger
    let lmd = await chargerRepository.openChargeMapLastModifiedDate();
    let queryUrl = `${ocmUrl}&countrycode=${process.env.COUNTRY}&verbose=false`
    if(lmd){
        // if lmd is populated we will limit the
        // query to save unnecessary processing:
        // expected format: yyyy-mm-dd
        queryUrl = `${queryUrl}&modifiedsince=${lmd.toISOString()}`
    }
    console.log(`querying: ${queryUrl}`);

    let ocmChargers = JSON.parse(await rp(queryUrl));  
    if(ocmChargers){
        console.log(`chargers found, processing ${ocmChargers.length} new chargers`)
        let chargersToAdd = [];
        for(let i = 0; i < ocmChargers.length; i++){
            let ocmCharger = ocmChargers[i];
            let connections = [];
            for(let x = 0; x < ocmCharger.Connections.length; x++){
                connections.push({
                    type: ocmCharger.Connections[x].ConnectionType.Title,                    
                    kw: ocmCharger.Connections[x].PowerKW,
                    currentType: ocmCharger.Connections[x].CurrentType.Title
                });
            }
            let network = null;
            if(ocmCharger.OperatorInfo){
                network = {
                    websiteURL: ocmCharger.OperatorInfo.WebsiteURL,
                    isPrivateIndividual: ocmCharger.OperatorInfo.IsPrivateIndividual,     
                    contactEmail: ocmCharger.OperatorInfo.ContactEmail,              
                    title: ocmCharger.OperatorInfo.Title
                };
            }
            let charger = new Charger({
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
                    dateLastVerified: ocmCharger.DateLastVerified
                } 
            });
            chargersToAdd.push(chargerRepository.addCharger(charger));
            console.log(charger);
        }
        let results = await Promise.all(chargersToAdd);
        console.log("chargers updated");
    }
}
