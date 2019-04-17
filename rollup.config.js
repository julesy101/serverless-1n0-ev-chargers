import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default {
    input: 'sdk/chargersApi.js', // our source file
    output: [
        {
            file: 'sdk/charger.api.bundle.js',
            format: 'cjs'
        }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [commonjs()]
};
