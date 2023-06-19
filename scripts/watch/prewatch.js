const { spawn } = require('child_process');
const config = require('./config');

const runScript = async script => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(script, {
      shell: true,
      stdio: 'inherit',
    });

    childProcess.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
};

const runPrewatchScripts = async () => {
  for (const script of config.preWatchScripts) {
    await runScript(script);
  }
};

module.exports = {
  runPrewatchScripts,
};
