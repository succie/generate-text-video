import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [nodeResolve({ browser: true, preferBuiltins: false }), svelte()],
  build: {
    sourcemap: true,
    polyfillDynamicImport: true,
    commonjsOptions: {
      dynamicRequireTargets: [
        'node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
        'node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm',
        'node_modules/@ffmpeg/core/dist/ffmpeg-core.worker.js'
      ]
    }
  },
  resolve: {
    mainFields: ['browser', 'module', 'main']
  }
});
