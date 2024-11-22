const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs/promises');

const rootPath = path.join(__dirname, '..');

const inheritanceAppPath = path.join(
  __dirname,
  '..',
  'packages',
  'app-support-inheritance',
);

const sdkPath = path.join(__dirname, '..', 'submodules', 'sdk');

const run = async () => {
  const args = process.argv.slice(2);
  const packageJson = JSON.parse(
    await fs.readFile(path.join(inheritanceAppPath, 'package.json'), 'utf8'),
  );

  const origionalPackageJson = structuredClone(packageJson);
  delete packageJson.dependencies['@cypherock/sdk-app-inheritance'];

  await fs.writeFile(
    path.join(inheritanceAppPath, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  console.log(`Running "pnpm install ${args.join(' ')}" on app...`);
  execSync(`pnpm install ${args.join(' ')}`, {
    cwd: rootPath,
    stdio: 'inherit',
  });

  await fs.writeFile(
    path.join(inheritanceAppPath, 'package.json'),
    JSON.stringify(origionalPackageJson, null, 2),
  );

  console.log('Running pnpm install on SDK...');
  execSync('pnpm install', { cwd: sdkPath, stdio: 'inherit' });

  console.log('Building SDK...');
  execSync('pnpm build', { cwd: sdkPath, stdio: 'inherit' });
  execSync('pnpm build:submodules', { cwd: rootPath, stdio: 'inherit' });
};

run();
