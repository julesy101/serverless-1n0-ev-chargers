const assert = require('chai').assert;
const Charger = require('../entities/charger')

const splitConnections = [{ 
    type: "CCS", 
    kw: 75, 
    currentType: "DC" 
},
{ 
    type: "Type 2", 
    kw: 22, 
    currentType: "AC" 
},
{ 
    type: "Type 2", 
    kw: 7.6, 
    currentType: "AC" 
}]

describe("charger connection features", () => {
    it('Max kw displays the higest power charger regardless of current type', () => {
        let charger = new Charger({ 
            connections : splitConnections 
        });
        assert.equal(charger.maxPower, 75);
      });
      it("total connections returns total connections regardless of current type", () => {
        let charger = new Charger({ 
            connections : splitConnections 
        });
        assert.equal(charger.totalConnections, 3);
      });
      it("current types return unique values only", () => {
        let charger = new Charger({
            connections: splitConnections
        });
        assert.equal(charger.currentTypes[0], "DC");
        assert.equal(charger.currentTypes[1], "AC");
        assert.equal(charger.currentTypes.length, 2);
      });
});
