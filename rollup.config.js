import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default {
    input: 'sdk/chargersApi.js', // our source file
    output: [
        {
            file: 'sdk/charger.api.bundle.js',
            format: 'cjs',
            exports: 'named'
        }
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [replace(), commonjs()]
};
