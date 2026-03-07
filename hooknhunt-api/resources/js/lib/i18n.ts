import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// সরাসরি ইমপোর্ট করছি যাতে অফলাইনেও ভাষা পাওয়া যায়
import en from '../locales/en.json';
import bn from '../locales/bn.json';

// মডিউলার ট্রান্সলেশন ফাইল ইমপোর্ট
import procurementEn from '../locales/modules/en/procurement.js';
import procurementBn from '../locales/modules/bn/procurement.js';

// মডিউল মার্জ করা
const enTranslation = {
  ...en,
  procurement: procurementEn
};

const bnTranslation = {
  ...bn,
  procurement: procurementBn
};

i18n
  // ইউজারের ভাষা ডিটেক্ট করবে (localStorage বা Browser setting থেকে)
  .use(LanguageDetector)
  // React এর সাথে কানেক্ট করা
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      bn: { translation: bnTranslation }
    },
    // lng: 'en', // Removed - let LanguageDetector decide from localStorage
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