const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).expect;
const ChargerApiSdk = require('../sdk/chargersApi');
const RequestWrapper = require('../utilities/request-wrapper').RequestWrapper;
const crp = require('./mocks/chargerRepositoryMocks');
describe("charger external sdk", () => {
    it("rejects an invalid add charger model before calling the endpoint", async () => {
        let rputFake = sinon.stub(RequestWrapper.prototype, 'put').callsFake((url, body) => {});
        let api = new ChargerApiSdk();
        try {
            await api.addCharger({
                notValidKey: "this isnt a valid key",
                notValidCharger: "this isnt a valid charger"
            });
        } catch(e) {
            // we expect this to throw an error but for now we 
            // just want to see if it called our fake.
        }
        expect(rputFake).to.not.be.called;
    });
    it("add charger throws an error if model not valid", () => {
        let api = new ChargerApiSdk();
        expect(api.addCharger({
            notValidKey: "this isnt a valid key",
            notValidCharger: "this isnt a valid charger"
        })).to.be.rejectedWith(Error);
    });
    it("rejects an update charger model without an id populated", () => {
        let api = new ChargerApiSdk();
        expect(api.updateCharger({
            notValidKey: "this isnt a valid key",
            notValidCharger: "this isnt a valid charger"
        })).to.be.rejectedWith(Error);
    });
    it("rejects an update model with invalid field types", () => {
        let api = new ChargerApiSdk();
        let dummyC = crp.allChargers()[0];
        dummyC.network = "wait what?";

        expect(api.updateCharger(dummyC)).to.be.rejectedWith(Error);
    });
    it("no options passed creates an api proxy with process env APIBASEURL utilised", () => {
        let api = new ChargerApiSdk();
        expect(api.baseUrl).to.be.equal("http://baseUrl.com/dev")
    }); 
    it("passing options creates an api with the base url set to the option passed", () => {
        let api = new ChargerApiSdk("https://testapi.com/dev");
        expect(api.baseUrl).to.be.equal("https://testapi.com/dev");
    });
    it("searchByCoordinates rejects non number lat, lng or radius", () => {
        let api = new ChargerApiSdk();
        expect(api.searchChargerByCoordinates("not lat", -0.343, 10)).to.be.rejectedWith(Error);
        expect(api.searchChargerByCoordinates(57.675, "not lng", 10)).to.be.rejectedWith(Error);
        expect(api.searchChargerByCoordinates(57.675, -0.343, "not rad")).to.be.rejectedWith(Error);
    });
    it("getCharger rejects empty string or null string as  parameter", () => {
        let api = new ChargerApiSdk();
        expect(api.getCharger("")).to.be.rejectedWith(Error);
        expect(api.getCharger(null)).to.be.rejectedWith(Error);
    })

    beforeEach(() => {
        process.env.APIBASEURL = "http://baseUrl.com/dev"
    })

    afterEach(() => {
        delete process.env.APIBASEURL;
    })
});