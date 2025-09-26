import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  base: "./",
  plugins: [sveltekit()],
  build: {
    target: 'es2019',
  }
});
