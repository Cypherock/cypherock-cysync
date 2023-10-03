import fs from 'fs';
import { logFilePath } from '.';

export const getCySyncLogs = async (): Promise<string[]> => {
  const fileSize = (await fs.promises.stat(logFilePath)).size;
  const readStream = fs.createReadStream(logFilePath, {
    start: fileSize - 1024 * 1024,
    end: fileSize,
  });
  const logs = [];
  for await (const chunk of readStream) {
    logs.push(chunk);
  }
  return logs.join('').split('\n');
};
