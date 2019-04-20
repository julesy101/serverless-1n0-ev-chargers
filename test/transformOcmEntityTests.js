// eslint-disable-next-line prefer-destructuring
const expect = require('chai').expect;
const ocmMapper = require('../utilities/transformOcmEntity');
const mocks = require('./mocks/ocmResponseMocks');

describe('transform ocm entity', () => {
    it('skips connections with no current type', () => {
        const malformed = JSON.parse(mocks.chargerWithNoCurrentType);
        const charger = ocmMapper(malformed);
        expect(charger.connections.length).to.be.equal(0);
    });
    it('skips connections with no connection type', () => {
        const malformed = JSON.parse(mocks.chargerWithNoConnectionType);
        const charger = ocmMapper(malformed);
        expect(charger.connections.length).to.be.equal(0);
    });
});
