import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/siftapi.js',
  output: {
    file: 'dist/siftapi.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/request/rp.js': ['request-promise']
      }
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
