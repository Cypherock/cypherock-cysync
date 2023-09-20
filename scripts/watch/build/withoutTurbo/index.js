const lodash = require('lodash');

const config = require('../../config');
const spinner = require('../spinner');
const {
  getChalk,
  createLoggerWithPrefix,
  loggerWithNoPrefix,
} = require('../../logger');

const { getParsedPackages } = require('../../packages');
const createMultiBuildProcess = require('./multiprocess');

const buildLogger = createLoggerWithPrefix('Builder', config.logColors.builder);

let buildProcess;
let buildStartTime;

let hasBuildError = false;
let changedFiles = [];

const parsedPackages = getParsedPackages();

const isBuilding = () => !!buildProcess;

const abort = async () => {
  spinner.stop();

  if (buildProcess) {
    const chalk = await getChalk();
    buildLogger.info(chalk.blue(`Aborting build`));

    buildProcess.abort();
    buildProcess = undefined;
  }
};

const getBuildOptions = () => {
  const packagesList = [];

  for (const changedFile of changedFiles) {
    const packagePaths = Object.keys(parsedPackages);

    const packagePath = packagePaths.find(packagePath =>
      changedFile.includes(packagePath),
    );

    if (!packagePath) continue;

    packagesList.push({
      path: packagePath,
      name: parsedPackages[packagePath].name,
    });
  }

  return { packagesList: lodash.uniqBy(packagesList, 'name') };
};

const run = async () => {
  const chalk = await getChalk();

  await abort();

  const { packagesList } = getBuildOptions();

  if (packagesList.length <= 0) {
    buildLogger.info('No packages to build, skipping...');
    return;
  }

  buildStartTime = Date.now();
  stdOuts = [];

  spinner.create();

  buildProcess = createMultiBuildProcess({
    pkgs: packagesList,
    onSuccess: () => {
      buildProcess = undefined;
      spinner.clearInterval();

      const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);

      changedFiles = [];
      hasBuildError = false;

      spinner.setSuccess(
        {
          successfulTasks: packagesList.length,
          totalTasks: packagesList.length,
          cachedTasks: 0,
        },
        buildTime,
      );
    },
    onError: stdOuts => {
      buildProcess = undefined;
      spinner.clearInterval();

      const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);

      hasBuildError = true;
      spinner.setFailed(buildTime);

      buildLogger.info(chalk.red(`Build errors:`));
      lodash.takeRight(stdOuts, config.buildErrorLinesCount).forEach(error => {
        loggerWithNoPrefix.logNoNextLine(chalk.red(error));
      });
    },
  });
};

module.exports = {
  run,
  abort,
  hasError: () => hasBuildError,
  isBuilding,
  addChangedFiles: files => {
    changedFiles.push(files);
  },
};
