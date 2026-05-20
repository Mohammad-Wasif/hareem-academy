import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "../locales/en.json";
import urTranslations from "../locales/ur.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ur: { translation: urTranslations },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

// Set HTML dir and lang attributes on change
i18n.on("languageChanged", (lng) => {
  const dir = lng === "ur" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Initialize attributes
const initialLng = i18n.language || "en";
const initialDir = initialLng === "ur" ? "rtl" : "ltr";
document.documentElement.dir = initialDir;
document.documentElement.lang = initialLng;

export default i18n;
