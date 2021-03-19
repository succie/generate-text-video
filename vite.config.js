import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    mainFields: ['browser', 'module']
  }
});
