import fs from 'fs';
import path from 'path';

import { getLangStrings } from '@cypherock/cysync-core-constants';

import { config } from '../config';

export const generateTranslationFiles = async () => {
  // const i18nFolder = path.join(
  //   __dirname,
  //   '..',
  //   '..',
  //   '..',
  //   '..',
  //   'cysync-core',
  //   'src',
  //   'constants',
  //   'i18n',
  // );

  const i18Folder = path.join(config.DATA_FOLDER, 'i18n');

  await fs.promises.mkdir(i18Folder, { recursive: true });

  const enJson = getLangStrings('en');

  await fs.promises.writeFile(
    path.join(i18Folder, 'en.json'),
    JSON.stringify(enJson, undefined, 2),
  );
};
