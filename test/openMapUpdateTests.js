const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).expect;
const RequestWrapper = require('../utilities/request-wrapper').RequestWrapper;
const checkLatest = require('../tasks/openMapUpdate').checkLatest;
const ChargerRepository = require('../db/repository').ChargerRepository
const ocmResponses = require('./mocks/ocmResponseMocks');
const repoMocks = require('./mocks/chargerRepositoryMocks');

describe("open charge map update lambda", () => {
    let addChargerFake;
    let updateChargerFake;

    it("no last modified date runs the base query with max results", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => null)
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => Promise.resolve());   
        
        let ocmFake = sinon.stub(RequestWrapper.prototype, 'get')
                           .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();
        expect(ocmFake).to.be.calledOnceWith('https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&verbose=false&maxresults=10');
    });
    it("last modified date sets the modified date query string with an iso string", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => Promise.resolve());   
        
        let ocmFake = sinon.stub(RequestWrapper.prototype, 'get')
                           .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();
        expect(ocmFake).to.be.calledOnceWith('https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&verbose=false&maxresults=10&modifiedsince=2019-04-01T23:00:00.000Z');
    });
    it("no chargers returned bypasses processing", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => Promise.resolve());   
        
        sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve("[]"))
        
        await checkLatest();

        expect(addChargerFake).to.not.be.called;
        expect(updateChargerFake).to.not.be.called;
    });
    it("connections without CurrentType and ConnectionType are ignored", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
                .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
                .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
                .callsFake((latest) => Promise.resolve());   
        
        sinon.stub(RequestWrapper.prototype, 'get')
                .callsFake(() => Promise.resolve(ocmResponses.malformedConnectionChargerResponse))
        
        await checkLatest();

        expect(addChargerFake.args[0][0].totalConnections).to.equal(1);
    });
    it("chargers without operator info are ignored", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
                .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
                .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
                .callsFake((latest) => Promise.resolve());   
        
        sinon.stub(RequestWrapper.prototype, 'get')
                .callsFake(() => Promise.resolve(ocmResponses.noOperatorResponse))
        
        await checkLatest();

        expect(addChargerFake).to.not.be.called;
    });
    it("chargers without connections are ignored", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
                .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
                .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers()));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
                .callsFake((latest) => Promise.resolve());   
        
        sinon.stub(RequestWrapper.prototype, 'get')
                .callsFake(() => Promise.resolve(ocmResponses.noConnectionChargerResponse))
        
        await checkLatest();

        expect(addChargerFake).to.not.be.called;
    });
    it("existing ocm chargers are updated and not duplicated", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers(ocmId)));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => Promise.resolve());   
        
        sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();
        
        expect(addChargerFake).to.not.be.called;
        expect(updateChargerFake).to.be.called;
    });
    it("most recent add (no update) persists lastStatusUpdate", async () => {
        let latestOcm;
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(null));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => {
                latestOcm = latest;
                return Promise.resolve();
             });   
        
        sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();

        expect(latestOcm.dateLastStatusUpdate).to.be.equal("2019-04-04T05:16:00Z");
    });
    it("most recent update (no add) persists lastStatusUpdate", async () => {
        let latestOcm;
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => Promise.resolve(repoMocks.ocmChargers(ocmId)));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => {
                latestOcm = latest;
                return Promise.resolve();
             });   
        
        sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();
        expect(latestOcm.dateLastStatusUpdate).to.be.equal("2019-04-04T05:16:00Z");
    });  
    it("request with both chargers to add and update persists most recent lastStatusUpdate", async () => {
        let latestOcm;
        let updateFound = false;
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => "2019-04-01T23:00:00Z")
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((ocmId) => {
                if(updateFound)
                    return Promise.resolve(null);
                
                updateFound = true;
                return Promise.resolve(repoMocks.ocmChargers(ocmId));
            });
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => {
                latestOcm = latest;
                return Promise.resolve();
             });    
        
        sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();
        expect(latestOcm.dateLastStatusUpdate).to.be.equal("2019-04-04T05:16:00Z");
    });

    beforeEach(() => {
        process.env.COUNTRY = "GB";
        process.env.MAXRESULTS = "10";
        // stub the repo layer to return an empty db:
        addChargerFake = sinon.stub(ChargerRepository.prototype, 'addCharger')
                              .callsFake((charger) => repoMocks.chargerAdd(charger));
        updateChargerFake = sinon.stub(ChargerRepository.prototype, 'updateCharger')
                                 .callsFake((charger) => repoMocks.updateCharger(charger));
    });
    afterEach(() => {
        delete process.env.COUNTRY;
        delete process.env.MAXRESULTS;

        addChargerFake = null;
        updateChargerFake = null;
        
        if(ChargerRepository.prototype.addCharger.restore)
            ChargerRepository.prototype.addCharger.restore();
        if(ChargerRepository.prototype.updateCharger.restore)
            ChargerRepository.prototype.updateCharger.restore();
        if(ChargerRepository.prototype.openChargeMapLastModifiedDate.restore)
            ChargerRepository.prototype.openChargeMapLastModifiedDate.restore();
        if(ChargerRepository.prototype.getOcmCharger.restore)    
            ChargerRepository.prototype.getOcmCharger.restore();
        if(ChargerRepository.prototype.setOpenChargeMapLastModifiedDate.restore)
            ChargerRepository.prototype.setOpenChargeMapLastModifiedDate.restore();
        if(RequestWrapper.prototype.get.restore)
            RequestWrapper.prototype.get.restore();
    });
});

