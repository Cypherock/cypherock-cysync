import fs from 'fs';

import { logFilePath } from '.';

export const getCySyncLogs = async (): Promise<string[]> => {
  const fileSize = (await fs.promises.stat(logFilePath)).size;
  const readStream = fs.createReadStream(logFilePath, {
    start: Math.max(0, fileSize - 1024 * 1024),
    end: fileSize,
  });
  const logLines = [];
  for await (const chunk of readStream) {
    logLines.push(chunk);
  }

  const logs: string[] = [];

  logLines
    .join('')
    .split('\n')
    .forEach(logLine => {
      try {
        // will throw an error if line is not a valid json
        JSON.parse(logLine);
        logs.push(logLine);
      } catch (err) {
        // ignore invalid json
      }
    });

  return logs;
};
