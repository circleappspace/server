import { initializeI18n } from '$lib/i18n';

// Locale 정규화 (en-US → en, ko-KR → ko)
function normalizeLocale(locale) {
  if (!locale) return 'ko';
  return locale.split(/[-_]/)[0].toLowerCase();
}

export function handle({ event, resolve }) {
  // 쿠키에서 언어 읽기
  let lang = event.cookies.get('lang');
  
  if (!lang) {
    const acceptLanguage = event.request.headers.get('accept-language');
    lang = acceptLanguage ? normalizeLocale(acceptLanguage.split(',')[0]) : 'ko';
  }
  
  lang = normalizeLocale(lang); // 한번 더 정규화
  initializeI18n(lang);
  event.locals.lang = lang;
  
  return resolve(event);
}