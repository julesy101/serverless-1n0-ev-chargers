class UnauthorizedError extends Error {
    constructor() {
        super('[401] Unauthorized');
    }
}
module.exports = UnauthorizedError;
