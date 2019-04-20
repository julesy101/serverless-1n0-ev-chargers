const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
const crp = require('./mocks/chargerRepositoryMocks');
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository');
const updateHandler = require('../handlers/update').updateCharger;
const BadRequestError = require('../utilities/errors/BadRequestError');

describe('update charger handler', () => {
    it('rejects an invalid model with bad request', () => {
        const invalidEvent = {
            body: {
                notValidCharger: 'true'
            }
        };
        expect(updateHandler(invalidEvent)).to.be.rejectedWith(BadRequestError);
    });
    it('rejects an empty event body', () => {
        expect(updateHandler({})).to.be.rejectedWith(BadRequestError);
    });
    it('uses geo enabled repository', async () => {
        const event = {
            body: crp.allChargers()[0]
        };
        const geoFake = sinon
            .stub(GeoEnabledChargerRepository, 'updateCharger')
            .callsFake(chrger => crp.updateCharger(chrger));
        await updateHandler(event);
        expect(geoFake).to.be.called;
    });
    it('successful add returns charger with id populated', async () => {
        const updateModel = crp.allChargers()[0];
        const originalUpdated = updateModel.updated;
        const event = {
            body: updateModel
        };
        sinon.stub(GeoEnabledChargerRepository, 'updateCharger').callsFake(chrger => crp.updateCharger(chrger));
        const charger = await updateHandler(event);
        expect(charger.updated).to.be.greaterThan(originalUpdated);
    });

    afterEach(() => {
        if (GeoEnabledChargerRepository.updateCharger.restore) GeoEnabledChargerRepository.updateCharger.restore();
    });
});
