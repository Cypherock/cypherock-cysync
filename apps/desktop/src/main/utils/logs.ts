import fs from 'fs';
import { logFilePath } from '.';

export const getCySyncLogs = async (): Promise<unknown[]> => {
  const fileSize = (await fs.promises.stat(logFilePath)).size;
  const readStream = fs.createReadStream(logFilePath, {
    start: fileSize - 1024 * 1024,
    end: fileSize,
  });
  const logLines = [];
  for await (const chunk of readStream) {
    logLines.push(chunk);
  }
  const logs = logLines
    .join('')
    .split('\n')
    .map(logLine => {
      try {
        return JSON.parse(logLine);
      } catch {
        return false;
      }
    })
    .filter(Boolean);

  return logs;
};
