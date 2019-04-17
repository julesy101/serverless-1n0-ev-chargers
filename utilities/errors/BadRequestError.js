class BadRequestError extends Error {
    constructor() {
        super('[400] Bad Request');
    }
}
module.exports = BadRequestError;
