const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
// eslint-disable-next-line prefer-destructuring
const GeoDataManager = require('dynamodb-geo').GeoDataManager;
const Charger = require('../entities/charger');
const ChargerRepository = require('../db/repository');
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository');
const mocks = require('./mocks/chargerRepositoryMocks');

describe('dynamodb geo enabled repository', () => {
    it('deletes main charger table entry if error occurs saving geo point', async () => {
        sinon.stub(GeoDataManager.prototype, 'putPoint').callsFake(() => {
            throw new Error('test failure');
        });
        sinon.stub(ChargerRepository, 'addCharger').callsFake(() => {
            return {
                id: 'ddggdfggdfgd',
                address: {
                    lat: 56.7955,
                    lng: -3.434
                }
            };
        });
        const delCharger = sinon.stub(ChargerRepository, 'deleteCharger').callsFake(chrger => chrger);
        try {
            await GeoEnabledChargerRepository.addCharger({ test: 'charger' });
        } catch (e) {
            // hold it and do noting
        }
        expect(delCharger).to.be.called;
    });
    it('throws an error if saving failed', () => {
        sinon.stub(GeoDataManager.prototype, 'putPoint').callsFake(() => {
            throw new Error('test failure');
        });
        sinon.stub(ChargerRepository, 'addCharger').callsFake(() => {
            return {
                id: 'ddggdfggdfgd',
                address: {
                    lat: 56.7955,
                    lng: -3.434
                }
            };
        });
        sinon.stub(ChargerRepository, 'deleteCharger').callsFake(chrger => chrger);
        expect(GeoEnabledChargerRepository.addCharger({ test: 'charger' })).to.be.rejectedWith(Error);
    });
    it('does not save geo point if error saving to main table', async () => {
        const putFake = sinon.stub(GeoDataManager.prototype, 'putPoint').callsFake(() => {});
        sinon.stub(ChargerRepository, 'addCharger').callsFake(() => {
            return null;
        });

        await GeoEnabledChargerRepository.addCharger({ test: 'charger' });

        expect(putFake).to.not.be.called;
    });
    it('add charger returns an instance of Charger', async () => {
        sinon.stub(GeoDataManager.prototype, 'putPoint').callsFake(() => {
            return {
                promise: () => Promise.resolve()
            };
        });
        sinon.stub(ChargerRepository, 'addCharger').callsFake(() => {
            return new Charger(mocks.allChargers()[0]);
        });
        const charger = await GeoEnabledChargerRepository.addCharger({ id: '' });
        expect(charger).to.be.instanceOf(Charger);
    });
    it('radius search ensures lat lng and radius are numbers', () => {
        expect(GeoEnabledChargerRepository.radiusSearch('not number', -3.42, 20)).to.be.rejectedWith(Error);
        expect(GeoEnabledChargerRepository.radiusSearch(34.56, 'not number', 20)).to.be.rejectedWith(Error);
        expect(GeoEnabledChargerRepository.radiusSearch(54.34, -3.42, 'not number')).to.be.rejectedWith(Error);
    });
    it('radius search returns instances of Charger', async () => {
        sinon.stub(GeoDataManager.prototype, 'queryRadius').callsFake(() => {
            return [{ id: 'someCharger' }, { id: 'someOtherCharger' }];
        });
        sinon.stub(ChargerRepository, 'getChargers').callsFake(() => {
            return mocks.allChargers().map(x => new Charger(x));
        });
        const chargers = await GeoEnabledChargerRepository.radiusSearch(57.243, -0.341, 1000);
        chargers.forEach(x => expect(x).to.be.instanceOf(Charger));
    });
    it('radius search returns null if not found', async () => {
        sinon.stub(GeoDataManager.prototype, 'queryRadius').callsFake(() => {
            return [];
        });
        sinon.stub(ChargerRepository, 'getChargers').callsFake(() => {
            return [];
        });
        const chargers = await GeoEnabledChargerRepository.radiusSearch(57.243, -0.341, 1000);
        expect(chargers).to.be.null;
    });
    it('radius search skips records not found in main table', async () => {
        sinon.stub(GeoDataManager.prototype, 'queryRadius').callsFake(() => {
            return [{ id: 'someCharger' }, { id: 'someOtherCharger' }];
        });
        sinon.stub(ChargerRepository, 'getChargers').callsFake(() => {
            return [];
        });
        const chargers = await GeoEnabledChargerRepository.radiusSearch(57.243, -0.341, 1000);
        expect(chargers.length).to.be.equal(0);
    });
    afterEach(() => {
        if (ChargerRepository.getChargers.restore) ChargerRepository.getChargers.restore();
        if (ChargerRepository.addCharger.restore) ChargerRepository.addCharger.restore();
        if (ChargerRepository.deleteCharger.restore) ChargerRepository.deleteCharger.restore();
        if (GeoDataManager.prototype.putPoint.restore) GeoDataManager.prototype.putPoint.restore();
        if (GeoDataManager.prototype.queryRadius.restore) GeoDataManager.prototype.queryRadius.restore();
    });
});
