const childProcess = require('child_process');

const execCommand = command => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
        return;
      }

      resolve(stdout.trim());
    });
  });
};

module.exports = execCommand;
