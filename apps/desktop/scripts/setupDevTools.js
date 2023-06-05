/**
 * Issue with electron supporting the latest react dev tools
 *
 * Ref:
 * https://github.com/facebook/react/issues/25843
 * https://github.com/electron/electron/issues/36545
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const download = require('download');
const decompress = require('decompress');
const pkg = require('../package.json');

let USER_DATA_PATH;
const reactDevToolsLink =
  'https://github.com/mondaychen/react/raw/017f120369d80a21c0e122106bd7ca1faa48b8ee/packages/react-devtools-extensions/ReactDevTools.zip';

if (process.platform === 'darwin') {
  USER_DATA_PATH = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    pkg.productName,
  );
} else if (process.platform === 'win32') {
  USER_DATA_PATH = path.join(
    os.homedir(),
    'AppData',
    'Roaming',
    pkg.productName,
  );
} else if (process.platform === 'linux') {
  USER_DATA_PATH = path.join(os.homedir(), '.config', pkg.productName);
} else {
  console.error('This script is not configured for your OS');
  process.exit(1);
}

const run = async () => {
  const zipPath = path.join(USER_DATA_PATH, 'extensions');
  const zipFilePath = path.join(zipPath, '/ReactDevTools.zip');
  const unzipPath = path.join(USER_DATA_PATH, 'extensions', 'reactDevTools');

  if (!fs.existsSync(unzipPath)) {
    console.log('Downloading react devtools...');
    await fs.promises.mkdir(zipPath, { recursive: true });
    await download(reactDevToolsLink, zipPath);
    await decompress(zipFilePath, unzipPath);
  } else {
    console.log('React devtools already exists');
  }
};

run();
