import vue from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: './src/entry-client.js',
  dest: './dist/client.js',
  format: 'iife',
  plugins: [
    vue(),
    buble(),
    nodeResolve(),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') })
  ]
}
