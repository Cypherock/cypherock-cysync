const path = require('path');
const watch = require('watch');
const lodash = require('lodash');
const { spawn } = require('child_process');

const config = require('./config');
const {
  getChalk,
  getOra,
  createLoggerWithPrefix,
  loggerWithNoPrefix,
} = require('./logger');
const { parseTurboLogs } = require('./turbo');

const logger = createLoggerWithPrefix('Watcher', config.logColors.watcher);
const buildLogger = createLoggerWithPrefix('Builder', config.logColors.builder);

let buildProcess;
let buildStartTime;
let stdOuts = [];

let spinner;
let updateSpinnerInterval;
let hasBuildError = false;

const getIsBuilding = () => !!buildProcess;

const abortBuild = async () => {
  clearUpdateSpinnerInterval();

  if (buildProcess) {
    const chalk = await getChalk();
    spinner.stop();

    buildLogger.info(chalk.blue(`Aborting build`));

    buildProcess.removeAllListeners();
    buildProcess.kill();
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

const clearUpdateSpinnerInterval = () => {
  if (updateSpinnerInterval) {
    clearInterval(updateSpinnerInterval);
  }
};

const runBuild = async () => {
  const chalk = await getChalk();
  const ora = await getOra();

  await abortBuild();

  buildStartTime = Date.now();
  stdOuts = [];

  spinner = ora({
    text: chalk.blue('Rebuilding...'),
    color: config.logColors.builder.replace('bg', '').toLowerCase(),
  }).start();
  updateSpinnerInterval = setInterval(updateSpinnerText, 1000);

  let buildProcess;
  if (process.platform === 'win32') {
    buildProcess = spawn('cmd', ['/s', '/c', 'pnpm', 'build:dirty']);
  } else {
    buildProcess = spawn('pnpm', ['build:dirty']);
  }

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
      hasBuildError = false;
      console.clear();
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
      onChange();
    });

    monitor.on('changed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File updated: ${name}`));
      onChange();
    });

    monitor.on('removed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File removed: ${name}`));
      onChange();
    });

    cleanUp = async () => {
      console.log(chalk.red('Stopping watch...'));
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
