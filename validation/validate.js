// eslint-disable-next-line prefer-destructuring
const Validator = require('jsonschema').Validator;
const ValidationResult = require('./ValidationResult');
const ValidationError = require('./ValidationError');
const addChargerModel = require('./models/addCharger');
const updateChargerModel = require('./models/updateCharger');

class ModelValidator {
    constructor() {
        this.validator = new Validator();
        this.validator.addSchema(addChargerModel);
        this.validator.addSchema(updateChargerModel);
    }

    validate(object, type) {
        const schema = this.validator.schemas[`/${type}`];
        if (!schema) return new ValidationResult(false, ['no schema found']);

        const result = this.validator.validate(object, schema);
        if (!result.valid || result.errors.length > 0)
            return new ValidationResult(
                false,
                result.errors.map(e => new ValidationError(e.propertyName, e.property, e.message))
            );

        return new ValidationResult(true, []);
    }

    get availableSchemas() {
        const out = [];
        Object.keys(this.validator.schemas).forEach(key => {
            out.push(key);
        });
        return out;
    }
}

module.exports = new ModelValidator();
