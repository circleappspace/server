import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./messages/en.json'));

export function initializeI18n(lang = 'en') {
  init({
    fallbackLocale: 'en',
    initialLocale: lang
  });
}