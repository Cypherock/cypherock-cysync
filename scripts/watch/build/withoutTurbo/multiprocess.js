const config = require('../../config');
const { createChildProcess } = require('../../spawn');
const { createLoggerWithPrefix } = require('../../logger');

const buildLogger = createLoggerWithPrefix('Builder', config.logColors.builder);

const createMultiBuildProcess = ({ pkgs, onSuccess, onError }) => {
  let stdOuts = {};

  const createOnData =
    ({ name }) =>
    data => {
      if (config.isVerbose) {
        buildLogger.logNoNextLine(`${name}: ${data}`);
      }

      if (stdOuts[name] === undefined) {
        stdOuts[name] = [];
      }

      stdOuts[name].push(data);
    };

  const buildProcesses = [];
  const buildProcessResults = {};
  let isAborted = false;

  pkgs.forEach(pkg => {
    const buildProcess = createChildProcess('pnpm', ['build:dirty'], {
      cwd: pkg.path,
    });

    buildProcesses.push(buildProcess);

    buildProcess.stdout.setEncoding('utf8');
    buildProcess.stderr.setEncoding('utf8');

    buildProcess.stdout.on('data', createOnData(pkg));

    buildProcessResults[pkg.name] = {
      isSuccess: false,
    };

    buildProcess.on('close', code => {
      if (code === 0) {
        buildProcessResults[pkg.name] = {
          isSuccess: true,
        };

        if (
          Object.values(buildProcessResults).every(b => b.isSuccess) &&
          !isAborted
        ) {
          onSuccess();
        }
      } else {
        buildProcesses.forEach(b => b.kill());
        buildProcessResults[pkg.name] = {
          isSuccess: false,
        };

        if (!isAborted) {
          onError(stdOuts[pkg.name]);
        }
      }
    });
  });

  return {
    abort: () => {
      isAborted = true;
      buildProcesses.forEach(b => b.kill());
    },
  };
};

module.exports = createMultiBuildProcess;
