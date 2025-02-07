const readline = require('readline/promises');
const path = require('path');
const fs = require('fs/promises');

const commonFolders = ['node_modules', 'coverage', 'dist', '.turbo'];

const packages = {
  'apps/desktop': [
    ...commonFolders,
    'dist-electron',
    'release',
    'playwright-report',
    'test-results',
    'screenshots',
    'videos',
  ],
  'apps/cli': [...commonFolders, 'release'],
  'apps/mobile': [...commonFolders, '.expo', 'android'],
  'packages/coin-support': [...commonFolders],
  'packages/app-support-inheritance': [...commonFolders],
  'packages/coin-support-evm': [...commonFolders],
  'packages/coin-support-btc': [...commonFolders],
  'packages/coin-support-solana': [...commonFolders],
  'packages/coin-support-near': [...commonFolders],
  'packages/coin-support-tron': [...commonFolders],
  'packages/coin-support-xrp': [...commonFolders],
  'packages/coin-support-stellar': [...commonFolders],
  'packages/coin-support-utils': [...commonFolders],
  'packages/coin-support-interfaces': [...commonFolders],
  'packages/coins': [...commonFolders],
  'packages/desktop-ui': [...commonFolders],
  'packages/ui': [...commonFolders, 'src/assets/icons/generated'],
  'packages/cysync-core': [...commonFolders, 'src/generated'],
  'packages/cysync-core-workers': [...commonFolders, 'lib', 'parcel'],
  'packages/util-eslint-config': ['node_modules'],
  'packages/util-prettier-config': ['node_modules'],
  'packages/util-jest-config': ['node_modules'],
  'packages/util-tsconfig': ['node_modules'],
};

const getPackages = async () => {
  const srcDirectories = ['apps', 'packages'];
  for (const d of srcDirectories) {
    const dirPath = path.join(__dirname, '..', d);
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const name = entry.name;
        if (
          !entry.isDirectory() ||
          name.startsWith('.') ||
          name.toLowerCase() === '.ds_store' ||
          name.toLowerCase() === 'ds_store'
        ) {
          continue;
        }

        const pkgKey = path.join(d, name);

        if (!packages[pkgKey]) {
          packages[pkgKey] = [...commonFolders];
        }
      }
    } catch (err) {
      console.log(`Path not found: ${dirPath}`);
    }
  }

  return packages;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const confirmFromUser = async (
  question,
  positiveResponse,
  negativeResponse,
) => {
  let response = '';
  do {
    response = await rl.question(`${question}: `);

    if (negativeResponse.includes(response.toLowerCase())) {
      process.exit(1);
    }
  } while (!positiveResponse.includes(response.toLowerCase()));
};

const doExists = async folderPath => {
  try {
    await fs.access(folderPath);
    return true;
  } catch (error) {
    return false;
  }
};

const removeFolders = async (parentDirectory, folders) => {
  for (const folder of folders) {
    const folderPath = path.join(parentDirectory, folder);

    if (await doExists(folderPath)) {
      console.log(`Deleting: ${folderPath}`);
      await fs.rm(folderPath, { recursive: true, force: true });
    }
  }
};

const run = async () => {
  const parentDir = path.join(__dirname, '..');
  const allFoldersToDelete = [];
  const isForce =
    process.argv.includes('--force') || process.argv.includes('-f');

  const resolvedPackages = await getPackages();

  for (const pkgName in resolvedPackages) {
    for (const folder of resolvedPackages[pkgName]) {
      allFoldersToDelete.push(path.join(pkgName, folder));
    }
  }

  console.log(allFoldersToDelete);
  if (!isForce) {
    await confirmFromUser(
      'Do you want to delete all the above folders? (y/n)',
      ['y', 'yes'],
      ['n', 'no'],
    );
  }

  console.log();
  console.log(`Working dir: ${parentDir}`);

  if (!isForce) {
    await confirmFromUser(
      `Please type the parent directory to confirm: (${path.basename(
        parentDir,
      )}/n)`,
      [path.basename(parentDir)],
      ['n', 'no'],
    );
  }

  await removeFolders(parentDir, allFoldersToDelete);

  rl.close();
};

run();
