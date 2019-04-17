class ValidationError {
    constructor(propName, prop, reason) {
        this.property = prop;
        this.propertyName = propName;
        this.reason = reason;
    }
}
module.exports = ValidationError;
