import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  base: "./",
  plugins: [sveltekit()],
  build: {
    target: 'es2019',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'https://circleapp.space' // Proxy /uploads to circleapp.space
    },
    allowedHosts: ["sch.shtelo.org", "localhost"]
  }
});
