const Validator =  require('jsonschema').Validator;
const addChargerModel = require('./models/addCharger');
const updateChargerModel = require('./models/updateCharger');

class ModelValidator {
    constructor(){
        this.validator = new Validator();
        this.validator.addSchema(addChargerModel);
        this.validator.addSchema(updateChargerModel);
    }

    validate(object, type){
        let schema = this.validator.schemas[`/${type}`];
        if(!schema)
            return new ValidationResult(false, ["no schema found"]);

        let result = this.validator.validate(object, schema)
        if(!result.valid || result.errors.length > 0)
            return new ValidationResult(false, result.errors.map(e => new ValidationError(e.propertyName, e.property, e.message)));
        
        return new ValidationResult(true, []);
    }

    get availableSchemas(){
        let out = [];
        for(let key in this.validator.schemas)
            out.push(key);

        return out;
    }
}

class ValidationResult {
    constructor(v,e){
        this.valid = v;
        this.errors = e;
    }
}

class ValidationError {
    constructor(propName, prop, reason){
        this.property = prop;
        this.propertyName = propName;
        this.reason = reason;
    }
}

module.exports = new ModelValidator();
module.exports.ValidationResult = ValidationResult;
module.exports.ValidationError = ValidationError;