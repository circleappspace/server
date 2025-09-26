import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // SPA 지원 필요 시
      precompress: false
    }),
    prerender: {
      handleHttpError: 'warn' // favicon 같은 누락된 파일 때문에 빌드 실패 안 나도록
    }
  }
};
