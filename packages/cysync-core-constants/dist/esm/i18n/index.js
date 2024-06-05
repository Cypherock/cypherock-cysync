import ar from './lang/ar-AE.json';
import de from './lang/de-DE.json';
import en from './lang/en.json';
import id from './lang/id-ID.json';
import zh from './lang/zh-CN.json';
export var LanguageList = [
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
var langs = {
    en: en,
    'de-DE': de,
    'ar-AE': ar,
    'zh-CN': zh,
    'id-ID': id,
};
var defaultLang = 'en';
export var getDefaultLang = function () { return defaultLang; };
export var getLangStrings = function (lang) {
    if (lang === void 0) { lang = defaultLang; }
    return langs[lang];
};
