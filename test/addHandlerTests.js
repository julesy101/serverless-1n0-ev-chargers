const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
const crp = require('./mocks/chargerRepositoryMocks');
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository');
const addHandler = require('../handlers/add').addCharger;
const BadRequestError = require('../utilities/errors/BadRequestError');

describe('add charger handler', () => {
    it('rejects an invalid model with bad request', () => {
        const invalidEvent = {
            body: {
                notValidCharger: 'true'
            }
        };
        expect(addHandler(invalidEvent)).to.be.rejectedWith(BadRequestError);
    });
    it('rejects an empty event body', () => {
        expect(addHandler({})).to.be.rejectedWith(BadRequestError);
    });
    it('uses geo enabled repository', async () => {
        const event = {
            body: crp.addChargerModelInput()
        };
        const geoFake = sinon.stub(GeoEnabledChargerRepository, 'addCharger').callsFake(() => crp.allChargers()[0]);
        await addHandler(event);
        expect(geoFake).to.be.called;
    });
    it('successful add returns charger with id populated', async () => {
        const event = {
            body: crp.addChargerModelInput()
        };
        sinon.stub(GeoEnabledChargerRepository, 'addCharger').callsFake(() => crp.allChargers()[0]);
        const charger = await addHandler(event);
        expect(charger.id).to.not.be.null;
        expect(charger.id).to.not.be.undefined;
    });

    afterEach(() => {
        if (GeoEnabledChargerRepository.addCharger.restore) GeoEnabledChargerRepository.addCharger.restore();
    });
});
