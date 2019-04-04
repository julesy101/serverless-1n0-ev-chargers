const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).expect;
const RequestWrapper = require('../utilities/request-wrapper').RequestWrapper;
const checkLatest = require('../tasks/openMapUpdate').checkLatest;
const ChargerRepository = require('../db/repository').ChargerRepository
const ocmResponses = require('./mocks/ocmResponseMocks');
const repoMocks = require('./mocks/chargerRepositoryMocks');

describe("open charge map sync lambda", () => {
    let addChargerFake;
    let updateChargerFake;

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

        ChargerRepository.prototype.addCharger.restore();
        ChargerRepository.prototype.updateCharger.restore();
    });
    it("no last modified date runs the base query with max results", async () => {
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => null)
        sinon.stub(ChargerRepository.prototype, 'getOcmCharger')
             .callsFake((latest) => Promise.resolve(repoMocks.ocmChargers(4343545)));
        sinon.stub(ChargerRepository.prototype, 'setOpenChargeMapLastModifiedDate')
             .callsFake((latest) => Promise.resolve());   
        
        let ocmFake = sinon.stub(RequestWrapper.prototype, 'get')
             .callsFake(() => Promise.resolve(ocmResponses.standardResponse))
        
        await checkLatest();

        expect(ocmFake).to.be.calledOnceWith('https://api.openchargemap.io/v3/poi/?output=json&countrycode=GB&verbose=false&maxresults=10');
    });
    it("last modified date sets the modified date query string with an iso string", () => {

    });
    it("no chargers returned bypasses processing", () => {

    });
    it("connections without CurrentType and ConnectionType are ignored", () => {

    });
    it("chargers without operator info are ignored", () => {

    });
    it("existing ocm chargers are updated and not duplicated", () => {

    });
    it("chargers to update have their internal attributes set", () => {

    });
    it("most recent add (no update) persists lastStatusUpdate", () => {

    });
    it("most recent update (no add) persists lastStatusUpdate", () => {

    });  
    it("request with both chargers to add and update persists most recent lastStatusUpdate", () => {

    });
});

