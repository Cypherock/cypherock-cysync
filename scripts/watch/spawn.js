const { spawn } = require('child_process');

const createChildProcess = (command, args, options, independent = false) => {
  let childProcess;

  if (independent === true) {
    options = {
      ...(options ?? {}),
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
