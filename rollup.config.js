import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
export default [
    {
        input: './index.ts',
        output: [{ name: 'bundle', file: './bundle/index.js', format: 'umd' }],
        strict: false,
        plugins: [
            resolve(),
            typescript({
                downlevelIteration: true,
                experimentalDecorators: true,
            }),
        ],
    },
    {
        input: './index.ts',
        output: [{ name: 'bundle', file: './lib/index.js', format: 'esm' }],
        strict: false,
        external: ['mark5'],
        plugins: [
            resolve(),
            typescript({
                downlevelIteration: true,
                experimentalDecorators: true,
            }),
        ],
    },
];
