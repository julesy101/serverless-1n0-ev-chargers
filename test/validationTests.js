// eslint-disable-next-line prefer-destructuring
const expect = require('chai').expect;
const modelValidator = require('../validation/validate');
const ValidationError = require('../validation/ValidationError');
const ValidationResult = require('../validation/ValidationResult');

const crm = require('./mocks/chargerRepositoryMocks');

describe('json schema model validator', () => {
    it('throws error if model not found', () => {
        const result = modelValidator.validate({}, 'notAModel');
        expect(result.valid).to.be.false;
    });
    it('is initialised with addChargerModel', () => {
        const schemas = modelValidator.availableSchemas;
        expect(schemas).to.include('/addChargerModel');
    });
    it('is initialised with updateChargerModel', () => {
        const schemas = modelValidator.availableSchemas;
        expect(schemas).to.include('/updateChargerModel');
    });
    it('wraps ValidationError in custom error', () => {
        const result = modelValidator.validate({}, 'addChargerModel');
        expect(result.valid).to.be.false;
        expect(result.errors[0]).to.be.instanceOf(ValidationError);
    });
    it('returns an instance of ValidationResult on success', () => {
        const result = modelValidator.validate(crm.addChargerModelInput(), 'addChargerModel');
        expect(result.valid).to.be.true;
        expect(result).to.be.instanceOf(ValidationResult);
    });
});
