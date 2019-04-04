const rp = require('request-promise-native');

class RequestWrapper {
    get(url){
        return rp(url);
    }
}

module.exports = new RequestWrapper();
module.exports.RequestWrapper = RequestWrapper;