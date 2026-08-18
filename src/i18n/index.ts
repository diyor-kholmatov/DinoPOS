import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import legacyEn from "@/i18n/locales/en.json";
import legacyRu from "@/i18n/locales/ru.json";
import legacyUz from "@/i18n/locales/uz.json";
import pilotEn from "@/i18n/pilot/en.json";
import pilotRu from "@/i18n/pilot/ru.json";
import pilotUz from "@/i18n/pilot/uz.json";
import { bootstrap } from "@/lib/legacy/bootstrap";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...legacyEn, ...pilotEn } },
    ru: { translation: { ...legacyRu, ...pilotRu } },
    uz: { translation: { ...legacyUz, ...pilotUz } },
  },
  lng: bootstrap.locale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };

