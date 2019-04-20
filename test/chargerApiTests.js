const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
const ChargerApiSdk = require('../sdk/chargersApi').Sdk;
const Charger = require('../entities/charger');
const RequestWrapper = require('../utilities/request-wrapper');
const crp = require('./mocks/chargerRepositoryMocks');

describe('charger external sdk', () => {
    it('rejects an invalid add charger model before calling the endpoint', async () => {
        const rputFake = sinon.stub(RequestWrapper, 'put').callsFake(() => {});
        const api = new ChargerApiSdk();
        try {
            await api.addCharger({
                notValidKey: 'this isnt a valid key',
                notValidCharger: 'this isnt a valid charger'
            });
        } catch (e) {
            // we expect this to throw an error but for now we
            // just want to see if it called our fake.
        }
        expect(rputFake).to.not.be.called;
    });
    it('addCharger throws an error if model not valid', () => {
        const api = new ChargerApiSdk();
        expect(
            api.addCharger({
                notValidKey: 'this isnt a valid key',
                notValidCharger: 'this isnt a valid charger'
            })
        ).to.be.rejectedWith(Error);
    });
    it('addCharger returns a concrete instance of Charger', async () => {
        sinon.stub(RequestWrapper, 'put').callsFake(() => {
            return Promise.resolve(crp.rawSerializedChargers()[0]);
        });
        const api = new ChargerApiSdk();
        const charger = await api.addCharger(crp.addChargerModelInput());
        expect(charger).to.be.instanceOf(Charger);
    });
    it('rejects an update charger model without an id populated', () => {
        const api = new ChargerApiSdk();
        expect(
            api.updateCharger({
                notValidKey: 'this isnt a valid key',
                notValidCharger: 'this isnt a valid charger'
            })
        ).to.be.rejectedWith(Error);
    });
    it('rejects an update model with invalid field types', () => {
        const api = new ChargerApiSdk();
        const dummyC = crp.allChargers()[0];
        dummyC.network = 'wait what?';

        expect(api.updateCharger(dummyC)).to.be.rejectedWith(Error);
    });
    it('updateCharger with valid model issues a post to the api', async () => {
        const postFake = sinon.stub(RequestWrapper, 'post').callsFake(() => {
            return Promise.resolve(crp.rawSerializedChargers()[0]);
        });
        const api = new ChargerApiSdk();
        await api.updateCharger(crp.rawSerializedChargers()[0]);

        expect(postFake).to.be.called;
    });
    it('updateCharger with valid model returns an instance of Charger', async () => {
        sinon.stub(RequestWrapper, 'post').callsFake(() => {
            return Promise.resolve(crp.rawSerializedChargers()[0]);
        });
        const api = new ChargerApiSdk();
        const charger = await api.updateCharger(crp.rawSerializedChargers()[0]);

        expect(charger).to.be.instanceOf(Charger);
    });
    it('passing options creates an api with the base url set to the option passed', () => {
        const api = new ChargerApiSdk('https://testapi.com/dev');
        expect(api.baseUrl).to.be.equal('https://testapi.com/dev');
    });
    it('searchByCoordinates rejects non number lat, lng or radius', () => {
        const api = new ChargerApiSdk();
        expect(api.searchChargerByCoordinates('not lat', -0.343, 1000)).to.be.rejectedWith(Error);
        expect(api.searchChargerByCoordinates(57.675, 'not lng', 1000)).to.be.rejectedWith(Error);
        expect(api.searchChargerByCoordinates(57.675, -0.343, 'not rad')).to.be.rejectedWith(Error);
    });
    it('searchByCoordinates rejects a radius < 1000', () => {
        const api = new ChargerApiSdk();
        expect(api.searchChargerByCoordinates(57.345, -0.343, 10)).to.be.rejectedWith(Error);
    });
    it('searchByCoordinates returns all instances as Chargers', async () => {
        sinon.stub(RequestWrapper, 'get').callsFake(() => {
            return Promise.resolve(crp.rawSerializedChargers());
        });
        const api = new ChargerApiSdk();
        const chargers = await api.searchChargerByCoordinates(57.034, -0.345, 1500);
        chargers.forEach(charger => {
            expect(charger).to.be.instanceOf(Charger);
        });
    });
    it('getCharger rejects empty string or null as a parameter', () => {
        const api = new ChargerApiSdk();
        expect(api.getCharger('')).to.be.rejectedWith(Error);
        expect(api.getCharger(null)).to.be.rejectedWith(Error);
    });
    it('getCharger returns a concrete instance of Charger', async () => {
        sinon.stub(RequestWrapper, 'get').callsFake(() => {
            return Promise.resolve(crp.rawSerializedChargers()[0]);
        });
        const api = new ChargerApiSdk();
        const charger = await api.getCharger('some_id');
        expect(charger).to.be.instanceOf(Charger);
    });
    it('deleteCharger rejects an empty string or null for charger id', () => {
        const api = new ChargerApiSdk();
        expect(api.deleteCharger('')).to.be.rejectedWith(Error);
        expect(api.deleteCharger(null)).to.be.rejectedWith(Error);
    });
    it('deleteCharger issues a delete to the charger endpoint', async () => {
        const dlFake = sinon.stub(RequestWrapper, 'delete').callsFake(() => {
            return Promise.resolve();
        });
        const api = new ChargerApiSdk();
        await api.deleteCharger('some_id');

        expect(dlFake).to.be.called;
        expect(dlFake.getCall(0).args[0]).to.be.equal('http://localhost:3000/chargers/delete/some_id');
    });

    afterEach(() => {
        if (RequestWrapper.get.restore) RequestWrapper.get.restore();

        if (RequestWrapper.put.restore) RequestWrapper.put.restore();

        if (RequestWrapper.post.restore) RequestWrapper.post.restore();

        if (RequestWrapper.delete.restore) RequestWrapper.delete.restore();
    });
});
