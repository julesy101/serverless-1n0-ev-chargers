class ForbiddenError extends Error {
    constructor() {
        super('[403] Forbidden');
    }
}
module.exports = ForbiddenError;
