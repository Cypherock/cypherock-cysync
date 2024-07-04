/* eslint-disable no-template-curly-in-string */
import fs from 'fs';
import path from 'path';

import {
  getLangStrings,
  LanguageList,
  getDefaultLang,
} from '@cypherock/cysync-core-constants';

import { translateLangWithOpenAI } from './openAi';

import { config } from '../config';

const DONT_TRANSLATE_PHRASES = [
  'X1 Vault',
  'CySync',
  'dust limit',
  'blockchain',
  'fee',
  'Cypherock',
  'WalletConnect',
  'Wallet Connect',
  'X1 Card',
  'CySync App',
  'Firmware',
  'Update',
  'Portfolio',
  'Wallets',
  'Version',
  '1D',
  '1W',
  '1M',
  '1Y',
  'Help',
  'Support',
];

export const generateTranslationFiles = async () => {
  const i18nFolder = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'cysync-core-constants',
    'src',
    'i18n',
    'lang',
  );

  const tempI18Folder = path.join(config.DATA_FOLDER, 'i18n');

  await fs.promises.mkdir(tempI18Folder, { recursive: true });

  const defaultLang = getDefaultLang();
  const defaultJson = getLangStrings(defaultLang);
  const alreadyDone: string[] = [];

  for (const { id } of LanguageList) {
    if (id === defaultLang || alreadyDone.includes(id)) {
      continue;
    }

    console.log(`Translating ${id}...`);
    console.time(`Translated ${id}`);
    const convertedJson = await translateLangWithOpenAI(defaultJson, id, {
      dontTranslatePhrases: DONT_TRANSLATE_PHRASES,
    });
    console.timeEnd(`Translated ${id}`);

    await fs.promises.writeFile(
      path.join(tempI18Folder, `${id}.json`),
      JSON.stringify(convertedJson, undefined, 2),
    );
    await fs.promises.writeFile(
      path.join(i18nFolder, `${id}.json`),
      JSON.stringify(convertedJson, undefined, 2),
    );
  }
};
