const fs = require('fs');

module.exports = options => {
    const deployLog = fs.readFileSync(options.deployLog, { encoding: 'utf-8' });
    const endpointMatches = deployLog.match(options.pattern);

    if (options.distinct) {
        const endpoints = endpointMatches.filter((v, i, s) => s.indexOf(v) === i);
        return endpoints.shift();
    }

    return undefined;
};
