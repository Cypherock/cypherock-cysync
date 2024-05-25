const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');

const coverageFolderPath = path.join(ROOT_DIR, 'coverage');
const coverageHtmlFolderPath = path.join(coverageFolderPath, 'html');
const coverageJsonFolderPath = path.join(coverageFolderPath, 'json');

const createFolderIfNotExists = folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

const createFolders = () => {
  if (fs.existsSync(coverageJsonFolderPath)) {
    fs.rmSync(coverageJsonFolderPath, { recursive: true });
  }
  createFolderIfNotExists(coverageFolderPath);
  createFolderIfNotExists(coverageHtmlFolderPath);
  createFolderIfNotExists(coverageJsonFolderPath);
};

const getCoverageFiles = async () => {
  const coverageFiles = [];
  const appsPath = path.join(ROOT_DIR, 'apps');
  const packagesPath = path.join(ROOT_DIR, 'packages');

  const appsList = await fs.promises.readdir(appsPath);
  const packagesList = await fs.promises.readdir(packagesPath);

  for (const app of appsList) {
    const appPath = path.join(appsPath, app);
    const coveragePath = path.join(appPath, 'coverage', 'coverage-final.json');
    if (fs.existsSync(coveragePath)) {
      coverageFiles.push(coveragePath);
    }
  }
  for (const package of packagesList) {
    const packagePath = path.join(packagesPath, package);
    const coveragePath = path.join(
      packagePath,
      'coverage',
      'coverage-final.json',
    );
    if (fs.existsSync(coveragePath)) {
      coverageFiles.push(path.join(coveragePath));
    }
  }

  return coverageFiles;
};

const mergeCoverages = async () => {
  const files = await getCoverageFiles();
  let i = 0;
  for (const file of files) {
    fs.copyFileSync(
      file,
      path.join(
        coverageJsonFolderPath,
        `${i.toString().padStart(2, '0')}-${path.basename(file)}`,
      ),
    );
    i += 1;
  }

  execSync(
    `nyc report --temp-dir ${coverageJsonFolderPath} --reporter html --report-dir ${coverageHtmlFolderPath}`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  const result = execSync(
    `nyc report --temp-dir ${coverageJsonFolderPath} --reporter text`,
  );

  execSync(`nyc report --temp-dir ${coverageJsonFolderPath} --reporter text`, {
    stdio: 'inherit',
    shell: true,
  });

  fs.writeFileSync(path.join(coverageFolderPath, 'report.txt'), result);

  execSync(
    `nyc report --temp-dir ${coverageJsonFolderPath} --reporter json --report-dir ${coverageJsonFolderPath}`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );
};

const run = async () => {
  createFolders();
  await mergeCoverages();
};

run();
