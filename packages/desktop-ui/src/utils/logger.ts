import {
  setLogger as setCoreLogger,
  loggerServiceName as coreLoggerServiceName,
} from '@cypherock/cysync-core';
import { ILogger } from '@cypherock/cysync-interfaces';

const createServiceLogger = (serviceName: string): ILogger => ({
  info: (message, meta) =>
    window.electronAPI.logWithServiceAndLevel(
      serviceName,
      'info',
      message,
      meta,
    ),
  debug: (message, meta) =>
    window.electronAPI.logWithServiceAndLevel(
      serviceName,
      'debug',
      message,
      meta,
    ),
  verbose: (message, meta) =>
    window.electronAPI.logWithServiceAndLevel(
      serviceName,
      'verbose',
      message,
      meta,
    ),
  warn: (message, meta) =>
    window.electronAPI.logWithServiceAndLevel(
      serviceName,
      'warn',
      message,
      meta,
    ),
  error: (message, meta) =>
    window.electronAPI.logWithServiceAndLevel(
      serviceName,
      'error',
      message,
      meta,
    ),
});

setCoreLogger(createServiceLogger(coreLoggerServiceName));

export default createServiceLogger('desktop-ui');
