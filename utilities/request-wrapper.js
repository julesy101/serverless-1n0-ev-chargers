const rp = require('request-promise-native');
/* istanbul ignore next */
class RequestWrapper {
    static get(url) {
        return rp(url);
    }

    static post(url, body, headers) {
        const options = {
            method: 'POST',
            uri: url,
            json: true
        };
        if (body) options.body = body;
        if (headers) options.headers = headers;

        return rp(options);
    }

    static put(url, body, headers) {
        const options = {
            method: 'PUT',
            uri: url,
            json: true
        };
        if (body) options.body = body;
        if (headers) options.headers = headers;

        return rp(options);
    }

    static delete(url, body, headers) {
        const options = {
            method: 'DELETE',
            uri: url,
            json: true
        };
        if (body) options.body = body;
        if (headers) options.headers = headers;

        return rp(options);
    }
}

module.exports = RequestWrapper;
