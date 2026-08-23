import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import legacyEn from "@/i18n/locales/en.json";
import legacyRu from "@/i18n/locales/ru.json";
import legacyUz from "@/i18n/locales/uz.json";
import pilotEn from "@/i18n/pilot/en.json";
import pilotRu from "@/i18n/pilot/ru.json";
import pilotUz from "@/i18n/pilot/uz.json";
import { bootstrap } from "@/lib/legacy/bootstrap";

function normalizeLegacyTemplates<T extends Record<string, unknown>>(source: T): T {
  return Object.fromEntries(Object.entries(source).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, value.replace(/(?<!\{)\{([A-Za-z][A-Za-z0-9_]*)\}(?!\})/g, "{{$1}}")];
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [key, normalizeLegacyTemplates(value as Record<string, unknown>)];
    }
    return [key, value];
  })) as T;
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...normalizeLegacyTemplates(legacyEn), ...pilotEn } },
    ru: { translation: { ...normalizeLegacyTemplates(legacyRu), ...pilotRu } },
    uz: { translation: { ...normalizeLegacyTemplates(legacyUz), ...pilotUz } },
  },
  lng: bootstrap.locale,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };
