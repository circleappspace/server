import { initializeI18n } from '$lib/i18n';
import { setLanguage } from '$lib/i18n/store';
import Cookies from 'js-cookie';

// Locale 정규화 (en-US → en, ko-KR → ko)
function normalizeLocale(locale) {
  if (!locale) return 'en';
  return locale.split(/[-_]/)[0].toLowerCase();
}

export async function init() {
  // 쿠키에서 언어 읽기
  let lang = Cookies.get('lang');
  
  if (!lang) {
    const acceptLanguage = navigator.language || navigator.userLanguage;
    lang = acceptLanguage ? normalizeLocale(acceptLanguage.split(',')[0]) : 'en';
  }
  
  lang = normalizeLocale(lang); // 한번 더 정규화
  
  initializeI18n(lang);
  setLanguage(lang);
}