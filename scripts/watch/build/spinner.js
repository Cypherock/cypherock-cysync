const config = require('../config');
const { getChalk, getOra } = require('../logger');

let spinner;
let updateSpinnerInterval;
let startTime = Date.now();

const updateSpinnerText = async () => {
  if (spinner) {
    const chalk = await getChalk();
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(0);

    if (buildTime > config.buildTimeWarnThreshold) {
      spinner.text = chalk.blue(`Rebuilding... `) + chalk.red(`${buildTime}s`);
    } else {
      spinner.text =
        chalk.blue(`Rebuilding... `) + chalk.yellow(`${buildTime}s`);
    }
  }
};

const clearSpinnerInterval = () => {
  if (updateSpinnerInterval) {
    clearInterval(updateSpinnerInterval);
  }
};

const create = async () => {
  startTime = Date.now();
  const ora = await getOra();
  spinner = ora({
    text: (await getChalk()).blue('Rebuilding...'),
    color: config.logColors.builder.replace('bg', '').toLowerCase(),
  }).start();
  updateSpinnerInterval = setInterval(updateSpinnerText, 1000);
};

const stop = () => {
  clearInterval();

  if (spinner) {
    spinner.stop();
    spinner = undefined;
  }
};

const setSuccess = async (result, buildTime) => {
  const chalk = await getChalk();
  if (spinner) {
    spinner.succeed(
      chalk.green(`Built `) +
        chalk.yellow(`${result.successfulTasks}/${result.totalTasks}`) +
        chalk.green(` packages `) +
        chalk.yellow(`(${result.cachedTasks} cached) `) +
        chalk.green(`in `) +
        chalk.yellow(`${buildTime}s`),
    );
  }
};

const setFailed = async buildTime => {
  const chalk = await getChalk();
  if (spinner) {
    spinner.fail(chalk.red(`Build error in `) + chalk.yellow(`${buildTime}s`));
  }
};

module.exports = {
  clearInterval: clearSpinnerInterval,
  create,
  stop,
  setSuccess,
  setFailed,
};
