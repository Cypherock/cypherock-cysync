import en, { LanguageStrings } from './en';
// import addAccount, { AddAccountStrings } from './addAccount';

export type { LanguageStrings } from './en';
export type { AddAccountStrings } from './addAccount';

export const LanguageMap = {
  en: 'en',
} as const;

export type Language = (typeof LanguageMap)[keyof typeof LanguageMap];

// Updated to include the AddAccountStrings
type LanguageContent = LanguageStrings;

const langs: Record<Language, LanguageContent> = {
  en: {
    ...en,
  },
};

const defaultLang: Language = 'en';

export const getDefaultLang = (): Language => defaultLang;
export const getLangStrings = (lang: Language = defaultLang) => langs[lang];
