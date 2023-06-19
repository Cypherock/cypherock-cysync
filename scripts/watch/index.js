const { spawn } = require('child_process');

const {
  startWatching,
  stopWatching,
  getIsBuilding,
  getHasBuildError,
} = require('./watch');
const { createLoggerWithPrefix } = require('./logger');
const { parseRawLog } = require('./logParser');
const { runPrewatchScripts } = require('./prewatch');
const config = require('./config');

const logger = createLoggerWithPrefix('CySync', config.logColors.cysync);

const runDesktopApp = async () => {
  await runPrewatchScripts();

  const runDesktopProcess = spawn('pnpm', ['dev']);

  runDesktopProcess.stdout.setEncoding('utf8');
  runDesktopProcess.stderr.setEncoding('utf8');

  const onData = async data => {
    if (
      !config.isVerbose &&
      config.runDesktopIgnoreLogTerms.some(term => data.includes(term))
    ) {
      return;
    }

    if (getIsBuilding()) {
      return;
    }

    if (getHasBuildError()) {
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

runDesktopApp();
