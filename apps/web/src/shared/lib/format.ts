export const LOCALES = {
  en: "en-US",
  ru: "ru-RU",
  uz: "uz-UZ",
} as const;

export type LocaleCode = keyof typeof LOCALES;

export function formatMoney(value: number, locale: LocaleCode): string {
  return `${new Intl.NumberFormat(LOCALES[locale], {
    maximumFractionDigits: 0,
  }).format(Math.round(value))} UZS`;
}

export function formatDateTime(value: string, locale: LocaleCode): string {
  return new Intl.DateTimeFormat(LOCALES[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

