"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLangStrings = exports.getDefaultLang = exports.LanguageList = void 0;
var ar_AE_json_1 = __importDefault(require("./lang/ar-AE.json"));
var de_DE_json_1 = __importDefault(require("./lang/de-DE.json"));
var en_json_1 = __importDefault(require("./lang/en.json"));
var id_ID_json_1 = __importDefault(require("./lang/id-ID.json"));
var zh_CN_json_1 = __importDefault(require("./lang/zh-CN.json"));
exports.LanguageList = [
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
    en: en_json_1.default,
    'de-DE': de_DE_json_1.default,
    'ar-AE': ar_AE_json_1.default,
    'zh-CN': zh_CN_json_1.default,
    'id-ID': id_ID_json_1.default,
};
var defaultLang = 'en';
var getDefaultLang = function () { return defaultLang; };
exports.getDefaultLang = getDefaultLang;
var getLangStrings = function (lang) {
    if (lang === void 0) { lang = defaultLang; }
    return langs[lang];
};
exports.getLangStrings = getLangStrings;
