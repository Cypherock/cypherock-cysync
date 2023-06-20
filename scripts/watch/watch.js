const path = require('path');
const watch = require('watch');
const lodash = require('lodash');

const config = require('./config');
const {
  getChalk,
  getOra,
  createLoggerWithPrefix,
  loggerWithNoPrefix,
} = require('./logger');
const { parseTurboLogs } = require('./turbo');
const { getParsedPackages } = require('./packages');
const { createChildProcess } = require('./spawn');

const logger = createLoggerWithPrefix('Watcher', config.logColors.watcher);
const buildLogger = createLoggerWithPrefix('Builder', config.logColors.builder);

let buildProcess;
let buildStartTime;
let stdOuts = [];

let spinner;
let updateSpinnerInterval;
let hasBuildError = false;
let changedFiles = [];

const parsedPackages = getParsedPackages();

const getIsBuilding = () => !!buildProcess;

const abortBuild = async () => {
  clearUpdateSpinnerInterval();

  if (spinner) {
    spinner.stop();
    spinner = undefined;
  }

  if (buildProcess) {
    const chalk = await getChalk();
    buildLogger.info(chalk.blue(`Aborting build`));

    buildProcess.kill();
    buildProcess.removeAllListeners();
    buildProcess = undefined;
  }
};

const updateSpinnerText = async () => {
  if (spinner) {
    const chalk = await getChalk();
    const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(0);

    if (buildTime > config.buildTimeWarnThreshold) {
      spinner.text = chalk.blue(`Rebuilding... `) + chalk.red(`${buildTime}s`);
    } else {
      spinner.text =
        chalk.blue(`Rebuilding... `) + chalk.yellow(`${buildTime}s`);
    }
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

const clearUpdateSpinnerInterval = () => {
  if (updateSpinnerInterval) {
    clearInterval(updateSpinnerInterval);
  }
};

const runBuild = async () => {
  const chalk = await getChalk();
  const ora = await getOra();

  await abortBuild();

  const { args, doBuild } = getBuildOptions();

  if (!doBuild) {
    logger.info('No packages to build, skipping...');
    return;
  }

  buildStartTime = Date.now();
  stdOuts = [];

  spinner = ora({
    text: chalk.blue('Rebuilding...'),
    color: config.logColors.builder.replace('bg', '').toLowerCase(),
  }).start();

  updateSpinnerInterval = setInterval(updateSpinnerText, 1000);

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
    clearUpdateSpinnerInterval();

    const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);

    buildProcess = undefined;
    if (code === 0) {
      changedFiles = [];
      hasBuildError = false;

      const result = parseTurboLogs(stdOuts);
      spinner.succeed(
        chalk.green(`Built `) +
          chalk.yellow(`${result.successfulTasks}/${result.totalTasks}`) +
          chalk.green(` packages `) +
          chalk.yellow(`(${result.cachedTasks} cached) `) +
          chalk.green(`in `) +
          chalk.yellow(`${buildTime}s`),
      );
    } else {
      hasBuildError = true;
      spinner.fail(
        chalk.red(`Build error in `) + chalk.yellow(`${buildTime}s`),
      );

      buildLogger.info(chalk.red(`Build errors:`));
      lodash.takeRight(stdOuts, config.buildErrorLinesCount).forEach(error => {
        loggerWithNoPrefix.logNoNextLine(chalk.red(error));
      });
    }
  });
};

const onChange = lodash.debounce(runBuild, 500);

let cleanUp = async () => {};

const startWatching = async () => {
  const chalk = await getChalk();

  watch.createMonitor(config.watchDir, config.watchOptions, function (monitor) {
    const totalFiles = Object.keys(monitor.files).length;
    logger.info(chalk.green(`Watching ${totalFiles} files...`));

    monitor.on('created', function (f) {
      const name = path.basename(f);
      logger.info(chalk.cyan(`File created: ${name}`));
      changedFiles.push(f);
      onChange();
    });

    monitor.on('changed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File updated: ${name}`));
      changedFiles.push(f);
      onChange();
    });

    monitor.on('removed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File removed: ${name}`));
      changedFiles.push(f);
      onChange();
    });

    cleanUp = async () => {
      monitor.stop();
      await abortBuild();
    };
  });
};

const stopWatching = async () => {
  await cleanUp();
};

module.exports = {
  startWatching,
  getIsBuilding,
  getHasBuildError: () => hasBuildError,
  stopWatching,
};
