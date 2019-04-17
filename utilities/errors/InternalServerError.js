class InternalServerError extends Error {
    constructor() {
        super('[500] Internal Server Error');
    }
}
module.exports = InternalServerError;
