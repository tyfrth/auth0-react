import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import analyze from 'rollup-plugin-analyzer';

const isProduction = process.env.NODE_ENV === 'production';
const name = 'reactAuth0';
const input = 'src/index.tsx';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};
const plugins = [
  del({ targets: 'dist/*', runOnce: true }),
  typescript({ useTsconfigDeclarationDir: true }),
  external(),
  resolve(),
  replace({ __VERSION__: `'${pkg.version}'` }),
  analyze({ summaryOnly: true }),
];

export default [
  {
    input,
    output: [
      {
        name,
        file: 'dist/auth0-react.js',
        format: 'umd',
        globals,
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
    ],
  },
  ...(isProduction
    ? [
        {
          input,
          output: [
            {
              name,
              file: 'dist/auth0-react.min.js',
              format: 'umd',
              globals,
              sourcemap: true,
            },
          ],
          plugins: [...plugins, terser()],
        },
        {
          input,
          output: {
            name,
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
          },
          plugins,
        },
        {
          input,
          output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
          },
          plugins,
        },
      ]
    : []),
  
    /*...(isProduction ? [] : [
      {
        input: 'playground/src/index.ts',
        output: {
          file: 'playground/build/bundle.js',
          format: 'iife',
          sourcemap: true
        },
        plugins: [
          del({ targets: 'playground/build/*', runOnce: true }),
          typescript({ useTsconfigDeclarationDir: true }),
          dev({
            dirs: ['dist', 'playground/build'],
            open: true,
            port: 3000,
          }),
          livereload(),
        ]
      }
    ])*/
];
