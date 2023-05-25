import { ILogger } from '@cypherock/cysync-interfaces';
import { createDefaultConsoleLogger } from '@cypherock/cysync-utils';

export const createServiceLogger = (serviceName: string): ILogger => {
  const consoleLogger = createDefaultConsoleLogger(serviceName);

  return {
    info: (message, meta) => {
      consoleLogger.info(message, meta);
      window.electronAPI.logWithServiceAndLevel(
        serviceName,
        'info',
        message,
        meta,
      );
    },
    debug: (message, meta) => {
      consoleLogger.debug(message, meta);
      window.electronAPI.logWithServiceAndLevel(
        serviceName,
        'debug',
        message,
        meta,
      );
    },
    verbose: (message, meta) => {
      consoleLogger.verbose(message, meta);
      window.electronAPI.logWithServiceAndLevel(
        serviceName,
        'verbose',
        message,
        meta,
      );
    },
    warn: (message, meta) => {
      consoleLogger.warn(message, meta);
      window.electronAPI.logWithServiceAndLevel(
        serviceName,
        'warn',
        message,
        meta,
      );
    },
    error: (message, meta) => {
      consoleLogger.error(message, meta);
      window.electronAPI.logWithServiceAndLevel(
        serviceName,
        'error',
        message,
        meta,
      );
    },
  };
};

export default createServiceLogger('desktop-ui');
