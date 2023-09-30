import fs from 'fs/promises';
import { logFilePath } from '.';

export const getCySyncLogs = async (): Promise<string[]> => {
  const logsFileContent = await fs.readFile(logFilePath, 'utf8');
  const logs = logsFileContent.split('\n');
  return logs;
};
