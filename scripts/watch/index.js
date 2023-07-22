const lodash = require('lodash');
const { startWatching, stopWatching } = require('./watch');
const build = require('./build');
const { createLoggerWithPrefix } = require('./logger');
const { parseRawLog } = require('./logParser');
const { runPrewatchScripts } = require('./prewatch');
const config = require('./config');
const { createChildProcess } = require('./spawn');

const logger = createLoggerWithPrefix('CySync', config.logColors.cysync);

const runDesktopApp = async () => {
  await runPrewatchScripts();

  const runDesktopProcess = createChildProcess('pnpm', ['dev']);

  runDesktopProcess.stdout.setEncoding('utf8');
  runDesktopProcess.stderr.setEncoding('utf8');

  const onData = async data => {
    if (
      !config.isVerbose &&
      config.runDesktopIgnoreLogTerms.some(term => data.includes(term))
    ) {
      return;
    }

    if (build.isBuilding()) {
      return;
    }

    if (build.hasError()) {
      return;
    }

    if (data.includes(config.desktopLogLinePrefix)) {
      const parsedLog = await parseRawLog(data);
      parsedLog.forEach(log => logger.logNoNextLine(log));
    } else {
      logger.logNoNextLine(data);
    }
  };

  runDesktopProcess.stdout.on('data', onData);
  runDesktopProcess.stderr.on('data', onData);

  const cleanUp = async () => {
    stopWatching();
    runDesktopProcess.kill('SIGINT');
  };

  runDesktopProcess.on('close', () => {
    cleanUp();
    process.exit(0);
  });

  startWatching();

  process.on('SIGINT', function () {
    cleanUp();
  });

  process.on('SIGTERM', function () {
    cleanUp();
  });
};

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  const printFlags = (flag, description) => {
    const paddedFlag = lodash.padEnd(flag, 25, ' ');
    console.log(`\t${paddedFlag} ${description}`);
  };

  console.log(`Usage: pnpm start [options]`);
  console.log();
  printFlags('-t, --turbo', 'Use turbo to build packages');
  printFlags('-h, --help', 'Show this help message');
  printFlags('-v, --verbose', 'Show verbose output');
  printFlags('-s, --short-log', 'Show logs in short log format');
  printFlags('-d, --build-dependents', 'Build dependents when packages change');
  printFlags('-rc, --remote-cache', 'Enable remote cache while watching');
  process.exit(0);
}
runDesktopApp();
