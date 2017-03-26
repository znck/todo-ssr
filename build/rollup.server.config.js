import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'

export default {
  entry: './src/entry-server.js',
  dest: './dist/server.js',
  format: 'cjs',
  plugins: [vue({ css: false }), buble()],
  external: ['vue', 'vue-router']
}
