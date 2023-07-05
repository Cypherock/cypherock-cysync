import path from 'path';

import { _electron as electron } from '@playwright/test';

export async function prepElectronApp() {
  const appPath = path.join(
    __dirname,
    '..',
    '..',
    'dist-electron',
    'main',
    'index.js',
  );

  const electronApp = await electron.launch({
    args: [appPath],
  });

  electronApp.on('window', async page => {
    const filename = page.url().split('/').pop();
    console.log(`Window opened: ${filename}`);
  });

  return electronApp;
}
