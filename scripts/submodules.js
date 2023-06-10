const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');

const config = {
  subModuleRoot: 'submodules',
  submodules: [
    {
      name: 'sdk',
      packagesFolders: ['packages'],
      // Exact match
      ignorePackages: [
        'util-eslint-config',
        'util-prettier-config',
        'util-tsconfig',
      ],
    },
  ],
  appFolders: ['apps', 'packages'],
  pnpmStore: ['node_modules/.pnpm'],
};

const ROOT = path.join(__dirname, '..');

async function copyDir(src, dest) {
  if (src.endsWith('node_modules')) return;
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

async function parsePackages() {
  const packages = {};

  const subModuleRootPath = path.join(ROOT, config.subModuleRoot);

  for (const submodule of config.submodules) {
    const submodulePath = path.join(subModuleRootPath, submodule.name);

    console.log(`Running build in submodule: ${submodule.name}`);
    execSync('pnpm build', { cwd: submodulePath });

    for (const packagesFolder of submodule.packagesFolders) {
      const packageNames = (
        await fs.readdir(path.join(submodulePath, packagesFolder))
      ).filter(e => !(submodule.ignorePackages ?? []).includes(e));

      for (const pkg of packageNames) {
        const pkgPath = path.join(submodulePath, packagesFolder, pkg);
        const pkgJsonPath = path.join(pkgPath, 'package.json');
        const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath));

        packages[pkgJson.name] = {
          name: pkgJson.name,
          version: pkgJson.version,
          path: pkgPath,
        };
      }
    }
  }

  return packages;
}

async function copyPackages() {
  const packages = await parsePackages();

  for (const appFolder of config.appFolders) {
    const appPath = path.join(ROOT, appFolder);
    const appPackages = await fs.readdir(appPath);

    for (const appPkg of appPackages) {
      const appPkgPath = path.join(appPath, appPkg);
      if (!(await fs.stat(appPkgPath)).isDirectory()) continue;

      const appPkgJson = JSON.parse(
        await fs.readFile(path.join(appPkgPath, 'package.json')),
      );
      for (const dependency of Object.keys(appPkgJson.dependencies ?? {})) {
        const pkg = packages[dependency];
        if (pkg) {
          const copySource = pkg.path;
          const copyDestination = path.join(
            appPkgPath,
            'node_modules',
            pkg.name,
          );
          console.log(
            `Copying '${copySource.split(ROOT)[1]}' to '${
              copyDestination.split(ROOT)[1]
            }'`,
          );

          await copyDir(copySource, copyDestination);
        }
      }
    }
  }

  const packagesList = Object.values(packages);
  for (const pnpmFolder of config.pnpmStore) {
    const pnpmPath = path.join(ROOT, pnpmFolder);

    const pnpmPackageName = await fs.readdir(path.join(pnpmPath));

    for (const pnpmPackage of pnpmPackageName) {
      const pkg = packagesList.find(pkg =>
        pnpmPackage.startsWith(pkg.name.replace('/', '+')),
      );
      if (pkg) {
        const copySource = pkg.path;
        const copyDestination = path.join(pnpmPath, pnpmPackage);
        console.log(
          `Copying '${copySource.split(ROOT)[1]}' to '${
            copyDestination.split(ROOT)[1]
          }'`,
        );

        await copyDir(copySource, copyDestination);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const usage = 'Usage: node scripts/submodules.js <build>';

  if (args.length < 1 || args[0] !== 'build') {
    console.error(usage);
    process.exit(1);
  }

  copyPackages();
}

if (require.main === module) main();
