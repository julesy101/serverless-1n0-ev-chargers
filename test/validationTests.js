const modelValidator = require('../validation/validate');
const ValidationError = require('../validation/validate').ValidationError;
const ValidationResult = require('../validation/validate').ValidationResult;
const expect = require('chai').expect;
const crm = require('./mocks/chargerRepositoryMocks');

describe("json schema model validator", () => {
    it("throws error if model not found", () => {
        let result = modelValidator.validate({}, "notAModel");
        expect(result.valid).to.be.false;
    });
    it("is initialised with addChargerModel", () => {
        let schemas = modelValidator.availableSchemas;
        expect(schemas).to.include("/addChargerModel");
    });
    it("is initialised with updateChargerModel", () => {
        let schemas = modelValidator.availableSchemas;
        expect(schemas).to.include("/updateChargerModel");
    });
    it("wraps ValidationError in custom error", () => {
        let result = modelValidator.validate({}, "addChargerModel");
        expect(result.valid).to.be.false;
        expect(result.errors[0]).to.be.instanceOf(ValidationError);
    });
    it("returns an instance of ValidationResult on success", () => {
        let result = modelValidator.validate(crm.addChargerModelInput(), "addChargerModel");
        expect(result.valid).to.be.true;
        expect(result).to.be.instanceOf(ValidationResult);
    });
})