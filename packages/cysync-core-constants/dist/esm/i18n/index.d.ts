import { LanguageStrings } from './types';
export type { LanguageStrings } from './types';
export type Language = 'en' | 'de-DE' | 'ar-AE' | 'zh-CN' | 'id-ID';
export declare const LanguageList: {
    id: string;
    name: string;
}[];
export declare const getDefaultLang: () => Language;
export declare const getLangStrings: (lang?: Language) => LanguageStrings;
//# sourceMappingURL=index.d.ts.map