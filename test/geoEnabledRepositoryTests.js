const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised')).expect;
// eslint-disable-next-line prefer-destructuring
const GeoDataManager = require('dynamodb-geo').GeoDataManager;
const ChargerRepository = require('../db/repository');
const GeoEnabledChargerRepository = require('../db/geoEnabledRepository');

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
    it('radius search ensures lat lng and radius are numbers', () => {
        expect(GeoEnabledChargerRepository.radiusSearch('not number', -3.42, 20)).to.be.rejectedWith(Error);
        expect(GeoEnabledChargerRepository.radiusSearch(34.56, 'not number', 20)).to.be.rejectedWith(Error);
        expect(GeoEnabledChargerRepository.radiusSearch(54.34, -3.42, 'not number')).to.be.rejectedWith(Error);
    });

    afterEach(() => {
        if (ChargerRepository.addCharger.restore) ChargerRepository.addCharger.restore();
        if (ChargerRepository.deleteCharger.restore) ChargerRepository.deleteCharger.restore();
        if (GeoDataManager.prototype.putPoint.restore) GeoDataManager.prototype.putPoint.restore();
    });
});
