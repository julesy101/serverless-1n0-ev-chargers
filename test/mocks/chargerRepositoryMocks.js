const responseMocks = require('./ocmResponseMocks');
const Charger = require('../../entities/charger');
const ocmMapper = require('../../utilities/transformOcmEntity');

class MockRepositoryResults {
    static addChargerModelInput() {
        const charger = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z))[0];
        return charger;
    }

    static rawSerializedChargers() {
        const chargers = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z));
        chargers.forEach((chrg, idx) => {
            const charger = chrg;
            charger.id = `charger-id-${idx}`;
            charger.created = new Date().getTime();
            charger.updated = new Date().getTime();
        });
        return chargers;
    }

    static allChargers() {
        const chargers = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z));
        const final = [];
        chargers.forEach((x, idx) => {
            const charger = new Charger(x);
            charger.id = `charger-id-${idx}`;
            charger.created = new Date().getTime();
            charger.updated = new Date().getTime();
            final.push(charger);
        });
        return final;
    }

    static ocmChargers(idsToInclude) {
        const chargers = JSON.parse(responseMocks.standardResponse).map(z => ocmMapper(z));
        let finalCharger = null;
        chargers.forEach((x, idx) => {
            if (idsToInclude === x.ocmId) {
                const charger = new Charger(x);
                charger.id = `charger-id-${idx}`;
                charger.created = new Date().getTime();
                charger.updated = new Date().getTime();
                finalCharger = charger;
            }
        });
        return finalCharger;
    }

    static chargerAdd(charger) {
        const testCharger = charger;
        testCharger.id = `some-random-id-${new Date().getTime()}`;
        testCharger.created = new Date().getTime();
        testCharger.updated = new Date().getTime();

        return Promise.resolve(testCharger);
    }

    static updateCharger(charger) {
        const testCharger = charger;
        const date = new Date();
        testCharger.updated = date.setTime(date.getTime() + 1000);

        return Promise.resolve(testCharger);
    }
}

module.exports = MockRepositoryResults;
