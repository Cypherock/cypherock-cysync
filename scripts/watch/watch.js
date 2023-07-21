const path = require('path');
const watch = require('watch');
const lodash = require('lodash');

const config = require('./config');
const { getChalk, createLoggerWithPrefix } = require('./logger');
const build = require('./build');

const logger = createLoggerWithPrefix('Watcher', config.logColors.watcher);

const onChange = lodash.debounce(build.run, 500);

let cleanUp = async () => {};

const startWatching = async () => {
  const chalk = await getChalk();

  watch.createMonitor(config.watchDir, config.watchOptions, function (monitor) {
    const totalFiles = Object.keys(monitor.files).length;
    logger.info(chalk.green(`Watching ${totalFiles} files...`));

    monitor.on('created', function (f) {
      const name = path.basename(f);
      logger.info(chalk.cyan(`File created: ${name}`));
      build.addChangedFiles(f);
      onChange();
    });

    monitor.on('changed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File updated: ${name}`));
      build.addChangedFiles(f);
      onChange();
    });

    monitor.on('removed', function (f) {
      const name = path.basename(f);
      logger.info(chalk.blue(`File removed: ${name}`));
      build.addChangedFiles(f);
      onChange();
    });

    cleanUp = async () => {
      monitor.stop();
      await build.abort();
    };
  });
};

const stopWatching = async () => {
  await cleanUp();
};

module.exports = {
  startWatching,
  stopWatching,
};
