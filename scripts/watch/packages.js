const path = require('path');
const fs = require('fs');
const config = require('./config');

function getParsedPackages() {
  const packages = {};

  const packagesRootPath = path.join(config.ROOT, 'packages');
  const packagesList = fs.readdirSync(packagesRootPath);

  for (const packageName of packagesList) {
    const packagePath = path.join(packagesRootPath, packageName);

    const isDirectory = fs.statSync(packagePath).isDirectory();
    if (!isDirectory) continue;

    const packageJsonPath = path.join(packagePath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) continue;

    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath));

    packages[packagePath] = {
      name: pkgJson.name,
      version: pkgJson.version,
      path: packagePath,
    };
  }

  return packages;
}

module.exports = {
  getParsedPackages,
};
