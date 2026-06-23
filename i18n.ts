import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// JSON çeviri dosyalarımızı içeri aktarıyoruz
import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4', // 👈 'v3' yerine 'v4' yaptık
  resources,
  lng: Localization.getLocales()[0]?.languageTag?.substring(0, 2) || 'tr', 
  fallbackLng: 'tr',
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;