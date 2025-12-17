import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// This function loads all json files from the locales directory
// and arranges them in the structure that i18next expects.
const loadLocales = () => {
  const resources: Record<string, Record<string, any>> = {};
  
  // Using Vite's import.meta.glob to dynamically import all json files
  const locales = import.meta.glob('../locales/**/*.json', { eager: true });

  for (const path in locales) {
    const loadedModule = locales[path] as Record<string, any>;
    const lang = path.split('/')[2]; // e.g., 'en' or 'bn'
    const namespace = path.split('/')[3].replace('.json', ''); // e.g., 'inventory'
    
    if (!resources[lang]) {
      resources[lang] = {};
    }

    resources[lang][namespace] = loadedModule;
  }

  return resources;
};

i18n
  .use(initReactI18next)
  .init({
    resources: loadLocales(),
    lng: 'bn', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: true, // Enable debug mode
  });

export default i18n;