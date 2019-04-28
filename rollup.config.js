const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const pkg = require('./package.json');
const serverlessFunctionFinder = require('./utilities/serverlessFunctionFinder.rollup');

// capture our lambda output here and have it ready for the replace plugin:
const deployedEndpoint = serverlessFunctionFinder({
    deployLog: './deploy.out',
    pattern: /https:\/\/.*?.com\/.*?\//gm,
    distinct: true
});

module.exports = {
    input: 'sdk/chargersApi.js', // our source file
    output: [
        {
            file: 'sdk/charger.api.bundle.js',
            format: 'cjs',
            exports: 'named'
        }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
        replace({
            BASEURL: deployedEndpoint
        }),
        commonjs()
    ]
};
