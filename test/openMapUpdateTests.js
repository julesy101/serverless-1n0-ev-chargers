const sinon = require('sinon');
// eslint-disable-next-line prefer-destructuring
const expect = require('chai').use(require('sinon-chai')).expect;
const RequestWrapper = require('../utilities/request-wrapper');
// eslint-disable-next-line prefer-destructuring
const checkLatest = require('../tasks/openMapUpdate').checkLatest;
const ChargerRepository = require('../db/geoEnabledRepository');
const ocmResponses = require('./mocks/ocmResponseMocks');
const repoMocks = require('./mocks/chargerRepositoryMocks');

describe('open charge map update lambda', () => {
    let addChargerFake;
    let updateChargerFake;

    it('no last modified date runs the base query with max results', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => null);
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        const ocmFake = sinon
            .stub(RequestWrapper, 'get')
            .callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();
        expect(ocmFake).to.be.calledOnceWith(
            'https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&verbose=false&maxresults=10'
        );
    });
    it('last modified date sets the modified date query string with an iso string', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        const ocmFake = sinon
            .stub(RequestWrapper, 'get')
            .callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();
        expect(ocmFake).to.be.calledOnceWith(
            'https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&verbose=false&maxresults=10&modifiedsince=2019-04-01T23:01:00.000Z'
        );
    });
    it('no chargers returned bypasses processing', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve('[]'));

        await checkLatest();

        expect(addChargerFake).to.not.be.called;
        expect(updateChargerFake).to.not.be.called;
    });
    it('connections without CurrentType and ConnectionType are ignored', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        sinon
            .stub(RequestWrapper, 'get')
            .callsFake(() => Promise.resolve(ocmResponses.malformedConnectionChargerResponse));

        await checkLatest();

        expect(addChargerFake.args[0][0].totalConnections).to.equal(1);
    });
    it('chargers without operator info are ignored', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.noOperatorResponse));

        await checkLatest();

        expect(addChargerFake).to.not.be.called;
    });
    it('chargers without connections are ignored', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.noConnectionChargerResponse));

        await checkLatest();

        expect(addChargerFake).to.not.be.called;
    });
    it('existing ocm chargers are updated and not duplicated', async () => {
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon
            .stub(ChargerRepository, 'getOcmCharger')
            .callsFake(ocmId => Promise.resolve(repoMocks.ocmChargers(ocmId)));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(() => Promise.resolve());

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();

        expect(addChargerFake).to.not.be.called;
        expect(updateChargerFake).to.be.called;
    });
    it('most recent add (no update) persists lastStatusUpdate', async () => {
        let latestOcm;
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(() => Promise.resolve(null));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(latest => {
            latestOcm = latest;
            return Promise.resolve();
        });

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();

        expect(latestOcm.dateLastStatusUpdate).to.be.equal('2019-04-04T05:16:00Z');
    });
    it('most recent update (no add) persists lastStatusUpdate', async () => {
        let latestOcm;
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon
            .stub(ChargerRepository, 'getOcmCharger')
            .callsFake(ocmId => Promise.resolve(repoMocks.ocmChargers(ocmId)));
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(latest => {
            latestOcm = latest;
            return Promise.resolve();
        });

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();
        expect(latestOcm.dateLastStatusUpdate).to.be.equal('2019-04-04T05:16:00Z');
    });
    it('request with both chargers to add and update persists most recent lastStatusUpdate', async () => {
        let latestOcm;
        let updateFound = false;
        sinon.stub(ChargerRepository, 'openChargeMapLastModifiedDate').callsFake(() => '2019-04-01T23:00:00Z');
        sinon.stub(ChargerRepository, 'getOcmCharger').callsFake(ocmId => {
            if (updateFound) return Promise.resolve(null);

            updateFound = true;
            return Promise.resolve(repoMocks.ocmChargers(ocmId));
        });
        sinon.stub(ChargerRepository, 'setOpenChargeMapLastModifiedDate').callsFake(latest => {
            latestOcm = latest;
            return Promise.resolve();
        });

        sinon.stub(RequestWrapper, 'get').callsFake(() => Promise.resolve(ocmResponses.standardResponse));

        await checkLatest();
        expect(latestOcm.dateLastStatusUpdate).to.be.equal('2019-04-04T05:16:00Z');
    });

    beforeEach(() => {
        process.env.TEST = 'true';
        process.env.COUNTRY = 'GB';
        process.env.MAXRESULTS = '10';
        // stub the repo layer to return an empty db:
        addChargerFake = sinon
            .stub(ChargerRepository, 'addCharger')
            .callsFake(charger => repoMocks.chargerAdd(charger));
        updateChargerFake = sinon
            .stub(ChargerRepository, 'updateCharger')
            .callsFake(charger => repoMocks.updateCharger(charger));
    });
    afterEach(() => {
        delete process.env.TEST;
        delete process.env.COUNTRY;
        delete process.env.MAXRESULTS;

        addChargerFake = null;
        updateChargerFake = null;

        if (ChargerRepository.addCharger.restore) ChargerRepository.addCharger.restore();
        if (ChargerRepository.updateCharger.restore) ChargerRepository.updateCharger.restore();
        if (ChargerRepository.openChargeMapLastModifiedDate.restore)
            ChargerRepository.openChargeMapLastModifiedDate.restore();
        if (ChargerRepository.getOcmCharger.restore) ChargerRepository.getOcmCharger.restore();
        if (ChargerRepository.setOpenChargeMapLastModifiedDate.restore)
            ChargerRepository.setOpenChargeMapLastModifiedDate.restore();
        if (RequestWrapper.get.restore) RequestWrapper.get.restore();
    });
});
