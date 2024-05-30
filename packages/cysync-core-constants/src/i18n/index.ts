import ar from './lang/ar-AE.json';
import de from './lang/de-DE.json';
import en from './lang/en.json';
import id from './lang/id-ID.json';
import zh from './lang/zh-CN.json';
import { LanguageStrings } from './types';

export type { LanguageStrings } from './types';

export type Language = 'en' | 'de-DE' | 'ar-AE' | 'zh-CN' | 'id-ID';

export const LanguageList = [
  {
    id: 'en',
    name: 'English',
  },
  {
    id: 'de-DE',
    name: 'Deutsch',
  },
  {
    id: 'ar-AE',
    name: 'العربية',
  },
  {
    id: 'zh-CN',
    name: '简体中文',
  },
  {
    id: 'id-ID',
    name: 'Bahasa Indonesia',
  },
];

const langs: Record<Language, LanguageStrings> = {
  en,
  'de-DE': de,
  'ar-AE': ar,
  'zh-CN': zh,
  'id-ID': id,
};

const defaultLang: Language = 'en';

export const getDefaultLang = (): Language => defaultLang;
export const getLangStrings = (lang: Language = defaultLang) => langs[lang];
