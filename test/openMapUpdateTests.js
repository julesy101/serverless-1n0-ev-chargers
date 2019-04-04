const sinon = require('sinon');
const assert = require('chai').assert;
const rp = require('request');
const checkLatest = require('../tasks/openMapUpdate').checkLatest;
const ChargerRepository = require('../db/repository').ChargerRepository

describe("open charge map sync lambda", () => {
    beforeEach(() => {
        process.env.COUNTRY = "GB";
        process.env.MAXRESULTS = "10";
    });
    afterEach(() => {
        delete process.env.COUNTRY;
        delete process.env.MAXRESULTS;
    });
    it("no last modified date runs the base query with max results", () => {
        let calledUrl;
        sinon.stub(ChargerRepository.prototype, 'openChargeMapLastModifiedDate')
             .callsFake(() => null)
        //sinon.stub(rp.prototype)
        //     .callsFake(() => Promise.resolve("not valid json"))
        
        checkLatest();

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

