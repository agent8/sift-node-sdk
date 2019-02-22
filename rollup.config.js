import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/siftapi.js',
  output: {
    file: 'dist/siftapi.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    commonjs(),
    globals(),
    resolve({
      preferBuiltins: true
    }),
    builtins(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  external: ['sshpk']
};
