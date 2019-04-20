// eslint-disable-next-line prefer-destructuring
const assert = require('chai').assert;
const Charger = require('../entities/charger');

const splitConnections = [
    {
        type: 'CCS',
        kw: 75,
        currentType: 'DC'
    },
    {
        type: 'Type 2',
        kw: 22,
        currentType: 'AC'
    },
    {
        type: 'Type 2',
        kw: 7.6,
        currentType: 'AC'
    }
];

describe('charger connection features', () => {
    it('Max kw displays the higest power charger regardless of current type', () => {
        const charger = new Charger({
            connections: splitConnections
        });
        assert.equal(charger.maxPower, 75);
    });
    it('total connections returns total connections regardless of current type', () => {
        const charger = new Charger({
            connections: splitConnections
        });
        assert.equal(charger.totalConnections, 3);
    });
    it('no dbEntity object passed to constructor throws error', () => {
        assert.throw(() => new Charger());
    });
    it('network name returns network object title', () => {
        const charger = new Charger({
            network: {
                websiteURL: 'http://www.chargetimes.co.uk',
                isPrivateIndividual: false,
                contactEmail: 'hello@chargetimes.co.uk',
                title: 'Charge Times'
            },
            address: {
                title: 'new times building',
                addressLine1: '12 some street',
                town: 'London',
                stateOrProvince: 'London',
                postcode: 'SW1 4GH',
                country: 'GB',
                latitude: 57.112,
                longitude: -0.231
            },
            connections: splitConnections
        });
        assert.equal(charger.networkName, 'Charge Times');
    });
    it('town returns address object town', () => {
        const charger = new Charger({
            network: {
                websiteURL: 'http://www.chargetimes.co.uk',
                isPrivateIndividual: false,
                contactEmail: 'hello@chargetimes.co.uk',
                title: 'Charge Times'
            },
            address: {
                title: 'new times building',
                addressLine1: '12 some street',
                town: 'London',
                stateOrProvince: 'London',
                postcode: 'SW1 4GH',
                country: 'GB',
                latitude: 57.112,
                longitude: -0.231
            },
            connections: splitConnections
        });
        assert.equal(charger.town, 'London');
    });
    it('postcode returns address object postcode', () => {
        const charger = new Charger({
            network: {
                websiteURL: 'http://www.chargetimes.co.uk',
                isPrivateIndividual: false,
                contactEmail: 'hello@chargetimes.co.uk',
                title: 'Charge Times'
            },
            address: {
                title: 'new times building',
                addressLine1: '12 some street',
                town: 'London',
                stateOrProvince: 'London',
                postcode: 'SW1 4GH',
                country: 'GB',
                latitude: 57.112,
                longitude: -0.231
            },
            connections: splitConnections
        });
        assert.equal(charger.postcode, 'SW1 4GH');
    });
    it('current types return unique values only', () => {
        const charger = new Charger({
            connections: splitConnections
        });
        assert.equal(charger.currentTypes[0], 'DC');
        assert.equal(charger.currentTypes[1], 'AC');
        assert.equal(charger.currentTypes.length, 2);
    });
});
