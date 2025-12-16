import { initializeI18n } from '$lib/i18n';
import { setLanguage } from '$lib/i18n/store';

// Locale 정규화 (en-US → en, ko-KR → ko)
function normalizeLocale(locale) {
  if (!locale) return 'en';
  return locale.split(/[-_]/)[0].toLowerCase();
}

export async function init() {
  // 쿠키에서 언어 읽기
  let lang = document.cookie
    .split('; ')
    .find(row => row.startsWith('lang='))
    ?.split('=')[1] || 'en';
  
  lang = normalizeLocale(lang);
  initializeI18n(lang);
  setLanguage(lang);
}