import { ILogger } from '@cypherock/cysync-interfaces';

export const createDefaultConsoleLogger = (service: string): ILogger => ({
  info: (message, meta) => console.info(message, { service, ...(meta ?? {}) }),
  debug: (message, meta) =>
    console.debug(message, { service, ...(meta ?? {}) }),
  verbose: (message, meta) =>
    console.debug(message, { service, ...(meta ?? {}) }),
  warn: (message, meta) => console.warn(message, { service, ...(meta ?? {}) }),
  error: (message, meta) =>
    console.error(message, { service, ...(meta ?? {}) }),
});

export const mergeLoggers = (params: {
  newLogger: ILogger;
  defaultLogger: ILogger;
  currentLogger: ILogger;
}) => {
  const { newLogger, currentLogger, defaultLogger } = params;

  for (const key in newLogger) {
    if ((newLogger as any)[key]) {
      (currentLogger as any)[key] = (...args: any[]) => {
        (defaultLogger as any)[key](...args);
        (newLogger as any)[key](...args);
      };
    }
  }
};
