class GatewayTimeoutError extends Error {
    constructor() {
        super('[504] Gateway Timeout');
    }
}
module.exports = GatewayTimeoutError;
