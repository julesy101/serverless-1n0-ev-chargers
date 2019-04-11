const sinon = require('sinon');
const expect = require('chai').use(require('sinon-chai')).use(require('chai-as-promised')).expect;
const ChargerApiSdk = require('../sdk/chargersApi');
const RequestWrapper = require('../utilities/request-wrapper').RequestWrapper;
const responseMocks = require('./mocks/ocmResponseMocks');
const ocmMapper = require("../entities/charger").transformOcmEntity;

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
    it("add charger throws an error if model not valid", async () => {
        let api = new ChargerApiSdk();
        expect(api.addCharger({
            notValidKey: "this isnt a valid key",
            notValidCharger: "this isnt a valid charger"
        })).to.be.rejectedWith(Error);
    });
    it("rejects an update charger model without and id populated", () => {
        let api = new ChargerApiSdk();

        expect(api.updateCharger())
    });
    it("rejects an update model with invalid field types", () => {

    });
    it("no options passed creates an api proxy with process env APIBASEURL utilised", () => {

    });
    it("passing options creates an api with the base url set to the option passed", () => {

    });
    it("searchByCoordinates rejects non number lat, lng or radius", () => {

    });
    it("getCharger rejects empty string or null string as a search parameter", () => {

    })
});