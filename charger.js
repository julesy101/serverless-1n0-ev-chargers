class Charger {
    constructor(dbEntity){        
        this.id;
        this.ocmId;
        this.created;
        this.updated;
        this.connections = [];
        this.network;
        this.address;
        this.ocm;

        if(dbEntity)
        {
            let expConn = [];
            for(let i = 0; i < dbEntity.connections.length; i++){
                let itm = dbEntity.connections[i];
                expConn.push(new ChargerConnection(itm.type, itm.kw, itm.currentType));
            }
            dbEntity.connections = expConn;
            Object.assign(this, dbEntity);
        }
    }

    get maxPower() {
        let maxpower = 0;
        for(let i = 0; i < this.connections.length; i++){
            if(this.connections[i].kw > maxpower)
                maxpower = this.connections[i].kw;
        }
        return maxpower;
    }

    get totalConnections() {
        return this.connections.length;
    }

    get currentTypes(){
        return this.connections.map(x => x.currentType)
                               .filter((v,i,s) => s.indexOf(v) === i);
    }
}

class ChargerConnection {
    constructor(type, 
                kw, 
                currentType) {
        this.type = type;     
        this.kw = kw;
        this.currentType = currentType;
    }
}

module.exports = Charger;
module.exports.transformOcmEntity = (ocmCharger) => {
    let connections = [];
    if(!ocmCharger.ID)
        return null;

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
        return null;
    }

    return {
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
    };
}