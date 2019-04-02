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