import en, { LanguageStrings } from './en';

export type { LanguageStrings } from './en';

export const LanguageMap = {
  en: 'en',
} as const;

export type Language = (typeof LanguageMap)[keyof typeof LanguageMap];

const langs: Record<Language, LanguageStrings> = {
  en,
};

const defaultLang: Language = 'en';

export const getDefaultLang = (): Language => defaultLang;
export const getLangStrings = (lang: Language = defaultLang) => langs[lang];
