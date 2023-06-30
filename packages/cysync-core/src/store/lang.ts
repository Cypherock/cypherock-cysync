// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

import {
  getDefaultLang,
  getLangStrings,
  Language,
  LanguageStrings,
} from '../constants';

export interface ILangState {
  strings: LanguageStrings;
  lang: Language;
}

const initialState: ILangState = {
  strings: getLangStrings(getDefaultLang()),
  lang: getDefaultLang(),
} as ILangState;

export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (_, action: PayloadAction<Language>) => {
      const strings = getLangStrings(action.payload);

      if (!strings) {
        const defLang = getDefaultLang();
        return { strings: getLangStrings(defLang), lang: defLang };
      }

      return { strings, lang: action.payload };
    },
  },
});

export const { setLanguage } = langSlice.actions;

export const selectLanguage = (state: RootState) => state.lang;

export default langSlice.reducer;
