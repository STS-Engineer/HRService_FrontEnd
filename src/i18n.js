import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import frTranslations from "./locales/fr.json";
import esTranslations from "./locales/es.json";
import deTranslations from "./locales/de.json";
import hiTranslations from "./locales/hi.json";
import zhTranslations from "./locales/zh.json";
import trTranslations from "./locales/tr.json";

i18n.use(LanguageDetector);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
    es: { translation: esTranslations },
    de: { translation: deTranslations },
    hi: { translation: hiTranslations },
    zh: { translation: zhTranslations },
    tr: { translation: trTranslations },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
