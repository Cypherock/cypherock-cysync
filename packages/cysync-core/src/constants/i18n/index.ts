import en from './en';
import { LanguageStrings } from './type';

export * from './type';

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
