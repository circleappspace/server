import { writable } from 'svelte/store';
import { locale } from 'svelte-i18n';

export const userLanguage = writable('ko');

export function setLanguage(lang) {
  userLanguage.set(lang);
  locale.set(lang);
  // 쿠키에 저장 (클라이언트)
  if (typeof document !== 'undefined') {
    document.cookie = `lang=${lang}; path=/; max-age=${60*60*24*365}`;
  }
}