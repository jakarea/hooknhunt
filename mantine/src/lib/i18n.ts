import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// সরাসরি ইমপোর্ট করছি যাতে অফলাইনেও ভাষা পাওয়া যায়
import en from '../locales/en.json';
import bn from '../locales/bn.json';

i18n
  // ইউজারের ভাষা ডিটেক্ট করবে (localStorage বা Browser setting থেকে)
  .use(LanguageDetector)
  // React এর সাথে কানেক্ট করা
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn }
    },
    lng: 'en', // Default language is English
    fallbackLng: 'en', // ভাষা খুঁজে না পেলে ইংলিশ দেখাবে
    debug: false, // ডেভেলপমেন্টের সময় কনসোলে লগ দেখাবে

    interpolation: {
      escapeValue: false, // React অটোমেটিক XSS হ্যান্ডেল করে
    },

    // Offline Detection Config
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // ভাষা সিলেকশন মেমোরিতে সেভ থাকবে
    }
  });

export default i18n;