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
        } else {
            throw new Error('need a config object to create a charger');
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
