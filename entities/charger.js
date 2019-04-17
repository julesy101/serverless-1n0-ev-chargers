class ChargerConnection {
    constructor(type, kw, currentType) {
        this.type = type;
        this.kw = kw;
        this.currentType = currentType;
    }
}

class Charger {
    constructor(dbEntity) {
        this.id = null;
        this.ocmId = null;
        this.ocmId = null;
        this.created = null;
        this.updated = null;
        this.connections = [];
        this.network = null;
        this.address = null;
        this.ocm = null;

        if (dbEntity) {
            const expConn = [];
            dbEntity.connections.forEach(itm => {
                expConn.push(new ChargerConnection(itm.type, itm.kw, itm.currentType));
            });
            this.connections = expConn;
            Object.assign(this, dbEntity);
        }
    }

    get networkName() {
        return this.network.title;
    }

    get town() {
        return this.address.town;
    }

    get postcode() {
        return this.address.postcode;
    }

    get maxPower() {
        let maxpower = 0;
        this.connections.forEach(connection => {
            if (connection.kw > maxpower) maxpower = connection.kw;
        });
        return maxpower;
    }

    get totalConnections() {
        return this.connections.length;
    }

    get currentTypes() {
        return this.connections.map(x => x.currentType).filter((v, i, s) => s.indexOf(v) === i);
    }
}

module.exports = Charger;
module.exports.transformOcmEntity = ocmCharger => {
    const connections = [];
    if (!ocmCharger.ID || !ocmCharger.Connections) return null;
    ocmCharger.Connections.forEach(conn => {
        if (!conn.CurrentType || !conn.ConnectionType) return;

        if (conn.CurrentType.Title && conn.ConnectionType.Title) {
            connections.push({
                type: conn.ConnectionType.Title,
                kw: conn.PowerKW,
                currentType: conn.CurrentType.Title
            });
        }
    });

    let network = null;
    if (ocmCharger.OperatorInfo) {
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
        connections,
        network,
        address: {
            title: ocmCharger.AddressInfo.Title,
            addressLine1: ocmCharger.AddressInfo.AddressLine1,
            addressLine2: ocmCharger.AddressInfo.AddressLine2,
            town: ocmCharger.AddressInfo.Town,
            stateOrProvince: ocmCharger.AddressInfo.StateOrProvince,
            postcode: ocmCharger.AddressInfo.Postcode,
            country: ocmCharger.AddressInfo.Country.ISOCode,
            latitude: ocmCharger.AddressInfo.Latitude,
            longitude: ocmCharger.AddressInfo.Longitude
        },
        ocm: {
            id: ocmCharger.ID,
            uuid: ocmCharger.UUID,
            dateCreated: ocmCharger.DateCreated,
            dateLastStatusUpdate: ocmCharger.DateLastStatusUpdate
        }
    };
};
