const lodash = require('lodash');

const config = require('../config');
const spinner = require('./spinner');
const {
  getChalk,
  createLoggerWithPrefix,
  loggerWithNoPrefix,
} = require('../logger');

const { parseTurboLogs } = require('../turbo');
const { getParsedPackages } = require('../packages');
const { createChildProcess } = require('../spawn');

const buildLogger = createLoggerWithPrefix('Builder', config.logColors.builder);

let buildProcess;
let buildStartTime;
let stdOuts = [];

let hasBuildError = false;
let changedFiles = [];

const parsedPackages = getParsedPackages();

const isBuilding = () => !!buildProcess;

const abort = async () => {
  spinner.stop();

  if (buildProcess) {
    const chalk = await getChalk();
    buildLogger.info(chalk.blue(`Aborting build`));

    buildProcess.kill();
    buildProcess.removeAllListeners();
    buildProcess = undefined;
  }
};

const getBuildOptions = () => {
  const argsSet = new Set();
  let doBuild = false;

  if (!config.buildDependents) {
    for (const changedFile of changedFiles) {
      const packagePaths = Object.keys(parsedPackages);

      const packagePath = packagePaths.find(packagePath =>
        changedFile.includes(packagePath),
      );

      if (!packagePath) continue;

      doBuild = true;
      argsSet.add(`--filter=${parsedPackages[packagePath].name}`);
    }
  } else {
    doBuild = true;
  }

  const args = Array.from(argsSet);

  if (!config.enableRemoteCache) {
    argsSet.add('--remote-cache-timeout="0.1"');
  }

  return { doBuild, args };
};

const run = async () => {
  const chalk = await getChalk();

  await abort();

  const { args, doBuild } = getBuildOptions();

  if (!doBuild) {
    logger.info('No packages to build, skipping...');
    return;
  }

  buildStartTime = Date.now();
  stdOuts = [];

  spinner.create();

  buildProcess = createChildProcess('pnpm', ['build:dirty', ...args]);

  buildProcess.stdout.setEncoding('utf8');
  buildProcess.stderr.setEncoding('utf8');

  const onData = data => {
    if (config.isVerbose) {
      buildLogger.logNoNextLine(data);
    }

    stdOuts.push(data);
  };

  buildProcess.stdout.on('data', onData);
  buildProcess.stderr.on('data', onData);

  buildProcess.on('close', code => {
    spinner.clearInterval();

    const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);

    buildProcess = undefined;
    if (code === 0) {
      changedFiles = [];
      hasBuildError = false;

      const result = parseTurboLogs(stdOuts);
      spinner.setSuccess(result, buildTime);
    } else {
      hasBuildError = true;
      spinner.setFailed(buildTime);

      buildLogger.info(chalk.red(`Build errors:`));
      lodash.takeRight(stdOuts, config.buildErrorLinesCount).forEach(error => {
        loggerWithNoPrefix.logNoNextLine(chalk.red(error));
      });
    }
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
