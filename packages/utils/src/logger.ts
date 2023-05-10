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

export const updateLoggerObject = (params: {
  newLogger: ILogger;
  currentLogger: ILogger;
}) => {
  const { newLogger, currentLogger } = params;

  for (const key in newLogger) {
    if ((newLogger as any)[key]) {
      (currentLogger as any)[key] = (newLogger as any)[key];
    }
  }
};
