class BadGatewayError extends Error {
    constructor() {
        super('[502] Bad Gateway');
    }
}
module.exports = BadGatewayError;
