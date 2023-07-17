import {
  ChildProcessWithoutNullStreams,
  spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process';

export const runCli = async (cliArgs: string[]) => {
  return new Promise<string>((resolve, reject) => {
    let childProcess: ChildProcessWithoutNullStreams;

    const command = 'node';
    const args = ['bin/run', ...cliArgs];

    const options: SpawnOptionsWithoutStdio = {};

    if (process.platform === 'win32') {
      childProcess = spawn('cmd', ['/s', '/c', command, ...args], options);
    } else {
      childProcess = spawn(command, args, options);
    }

    const outputList: string[] = [];

    const onData = (data: string) => {
      outputList.push(data);
    };

    childProcess.stdout.setEncoding('utf8');
    childProcess.stderr.setEncoding('utf8');

    childProcess.stdout.on('data', onData);
    childProcess.stderr.on('data', onData);

    childProcess.on('close', code => {
      childProcess.removeAllListeners();
      const output = outputList.join('');
      if (code === 0) resolve(output);
      else reject(output);
    });
  });
};
