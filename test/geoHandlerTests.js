const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
const BadRequestError = require('../utilities/errors/BadRequestError');
const FileNotFoundError = require('../utilities/errors/FileNotFoundError');
const geo = require('../handlers/geo').geoLookup;
const chargerRepoMocks = require('./mocks/chargerRepositoryMocks');
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository');
const Charger = require('../entities/charger');

describe('geo lookup handler tests', () => {
    it('throws 400 bad request if lat or lng is not a number', () => {
        expect(
            geo({
                lat: 'sdfdf',
                lng: '-4.032',
                radius: '1500'
            })
        ).to.be.rejectedWith(BadRequestError);
        expect(
            geo({
                lat: '57.349',
                lng: 'flkdsl',
                radius: '1500'
            })
        ).to.be.rejectedWith(BadRequestError);
    });
    it('throws a 404 not found if no chargers found', () => {
        sinon.stub(GeoEnabledChargerRepository, 'radiusSearch').callsFake(() => {
            return Promise.resolve([]);
        });
        expect(
            geo({
                lat: '57.349',
                lng: '-4.032',
                radius: '1000'
            })
        ).to.be.rejectedWith(FileNotFoundError);
    });
    it('returns an array of chargers if found', async () => {
        sinon.stub(GeoEnabledChargerRepository, 'radiusSearch').callsFake(() => {
            return Promise.resolve(chargerRepoMocks.allChargers());
        });
        const chargers = await geo({
            lat: '57.349',
            lng: '-4.032',
            radius: '1000'
        });
        chargers.forEach(charger => {
            expect(charger).to.be.instanceOf(Charger);
        });
    });
    it('respects radius when passed', async () => {
        const radiusFake = sinon.stub(GeoEnabledChargerRepository, 'radiusSearch').callsFake(() => {
            return Promise.resolve(chargerRepoMocks.allChargers());
        });
        await geo({
            lat: '57.349',
            lng: '-4.032',
            radius: '5000'
        });
        expect(radiusFake.getCall(0).args[2]).to.be.equal(5000);
    });
    it('defaults to 1000m when radius not passed', async () => {
        const radiusFake = sinon.stub(GeoEnabledChargerRepository, 'radiusSearch').callsFake(() => {
            return Promise.resolve(chargerRepoMocks.allChargers());
        });
        await geo({
            lat: '57.349',
            lng: '-4.032'
        });
        expect(radiusFake.getCall(0).args[2]).to.be.equal(1000);
    });
    afterEach(() => {
        if (GeoEnabledChargerRepository.radiusSearch.restore) GeoEnabledChargerRepository.radiusSearch.restore();
    });
});
