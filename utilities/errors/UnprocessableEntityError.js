class UnprocessableEntityError extends Error {
    constructor() {
        super('[422] Unprocessable Entity');
    }
}
module.exports = UnprocessableEntityError;
