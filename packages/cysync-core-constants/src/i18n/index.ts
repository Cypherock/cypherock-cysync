import ar from './lang/ar-AE.json';
import de from './lang/de-DE.json';
import en from './lang/en.json';
import id from './lang/id-ID.json';
import zh from './lang/zh-CN.json';
import fr from './lang/fr-FR.json';
import { LanguageStrings } from './types';

export type { LanguageStrings } from './types';

export type Language = 'en' | 'de-DE' | 'ar-AE' | 'zh-CN' | 'id-ID' | 'fr-FR';

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
  {
    id: 'fr-FR',
    name: 'French',
  },
];

const defaultVendorDetails = {
  APP_NAME: 'cySync',
  PRODUCT_NAME: 'Cypherock',
  DEVICE_NAME: 'X1 Vault',
  CARD_NAME: 'X1 Card',
};

const replaceVendorDetails = (
  text: string,
  details: typeof defaultVendorDetails,
) => {
  let finalText = text;
  for (const [tag, replacement] of Object.entries(details)) {
    finalText = finalText.replaceAll(`-=${tag}=-`, replacement);
  }
  return finalText;
};

const injectVendorStrings = (data: LanguageStrings) => {
  const text = JSON.stringify(data);
  if ((window as any).cysyncEnv.VENDOR === 'odix') {
    return JSON.parse(
      replaceVendorDetails(text, {
        APP_NAME: 'Odix',
        PRODUCT_NAME: 'Odix Pay',
        DEVICE_NAME: 'Odix Vault',
        CARD_NAME: 'Odix Card',
      }),
    ) as LanguageStrings;
  }
  return JSON.parse(
    replaceVendorDetails(text, defaultVendorDetails),
  ) as LanguageStrings;
};

const langs: Record<Language, LanguageStrings> = {
  en: injectVendorStrings(en),
  'de-DE': injectVendorStrings(de),
  'ar-AE': injectVendorStrings(ar),
  'zh-CN': injectVendorStrings(zh),
  'id-ID': injectVendorStrings(id),
  'fr-FR': injectVendorStrings(fr),
};

const defaultLang: Language = 'en';

export const getDefaultLang = (): Language => defaultLang;
export const getLangStrings = (lang: Language = defaultLang) => langs[lang];
