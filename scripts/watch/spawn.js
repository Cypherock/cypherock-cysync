const { spawn } = require('child_process');

const createChildProcess = (command, args, independent = false) => {
  let childProcess;

  let options = {};

  if (independent === true) {
    options = {
      ...options,
      shell: true,
      stdio: 'inherit',
    };
  }

  if (process.platform === 'win32') {
    childProcess = spawn('cmd', ['/s', '/c', command, ...args], options);
  } else {
    childProcess = spawn(command, args, options);
  }

  return childProcess;
};

module.exports = {
  createChildProcess,
};
