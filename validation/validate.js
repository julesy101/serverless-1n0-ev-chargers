const Validator =  require('jsonschema').Validator;
const addChargerModel = require('./models/addCharger');

class ModelValidator {
    constructor(){
        this.validator = new Validator();
        this.validator.addSchema(addChargerModel);
    }

    validate(object, type){
        let schema = this.validator.schemas[`/${type}`];
        if(!schema)
            return new ValidationResult(false, ["no schema found"]);

        let result = this.validator.validate(object, schema)
        if(!result.valid || result.errors.length > 0)
            return new ValidationResult(false, result.errors)
        
        return new ValidationResult(true, []);
    }
}

class ValidationResult {
    constructor(v,e){
        this.valid = v;
        this.errors = e;
    }
}

module.exports = new ModelValidator();