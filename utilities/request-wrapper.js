const rp = require('request-promise-native');
/* istanbul ignore next */
class RequestWrapper {
    get(url){
        return rp(url);
    }
    post(url, body, headers){
        let options = {
            method: 'POST',
            uri: url,
            json: true 
        };
        if(body)
            options.body = body;
        if(headers)
            options.headers = headers;

        return rp(options);
    }
    put(url, body, headers){
        let options = {
            method: 'PUT',
            uri: url,
            json: true 
        };
        if(body)
            options.body = body;
        if(headers)
            options.headers = headers;

        return rp(options);
    }
    delete(url, body, headers){
        let options = {
            method: 'DELETE',
            uri: url,
            json: true 
        };
        if(body)
            options.body = body;
        if(headers)
            options.headers = headers;

        return rp(options);
    }
}

module.exports = new RequestWrapper();
module.exports.RequestWrapper = RequestWrapper;