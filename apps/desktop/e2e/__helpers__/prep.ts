import fs from 'fs';
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

  const userDataPath = path.join(
    __dirname,
    '..',
    '..',
    '.e2e-data',
    process.pid.toString(),
  );

  await fs.promises.rm(userDataPath, { recursive: true, force: true });

  const electronApp = await electron.launch({
    args: [appPath],
    env: {
      ...process.env,
      NODE_ENV: 'e2e',
      E2E_DATA_PATH: userDataPath,
    },
  });

  electronApp.on('window', async page => {
    const filename = page.url().split('/').pop();
    console.log(`Window opened: ${filename} (${path.basename(userDataPath)})`);
  });

  electronApp.on('close', async () => {
    console.log(`Window closed (${path.basename(userDataPath)})`);
  });

  return { electronApp, userDataPath };
}
