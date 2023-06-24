let chalk;
let ora;

const getChalk = async () => {
  if (chalk) return chalk;

  chalk = (await import('chalk')).default;

  return chalk;
};

const getOra = async () => {
  if (ora) return ora;

  ora = (await import('ora')).default;

  return ora;
};

const createLoggerWithPrefix = (prefix, bgColor) => ({
  info: async message => {
    const chalk = await getChalk();
    if (prefix) {
      console.log(chalk.black[bgColor](` ${prefix} `) + ' ' + message);
    } else {
      console.log(message);
    }
  },
  logNoNextLine: async message => {
    const chalk = await getChalk();
    if (prefix) {
      process.stdout.write(chalk.black[bgColor](` ${prefix} `) + ' ' + message);
    } else {
      console.log(message);
    }
  },
});

module.exports = {
  getChalk,
  getOra,
  createLoggerWithPrefix,
  loggerWithNoPrefix: createLoggerWithPrefix(),
};
