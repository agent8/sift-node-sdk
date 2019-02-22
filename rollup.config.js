import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/siftapi.js',
  output: [
    {
      file: 'dist/siftapi.js',
      format: 'cjs'
    },
    {
      file: 'dist/siftapi.es6.js',
      format: 'esm'
    }
  ],
  plugins: [
    json(),
    commonjs(),
    resolve({ preferBuiltins: true }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  external: ['sshpk']
};
