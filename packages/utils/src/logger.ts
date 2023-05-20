import { ILogger } from '@cypherock/cysync-interfaces';

const createDefaultMeta = (service: string, meta: any) => ({
  service,
  ...(meta ?? {}),
  timestamp: new Date(),
});

export const createDefaultConsoleLogger = (service: string): ILogger => ({
  info: (message, meta) =>
    console.info(message, createDefaultMeta(service, meta)),
  debug: (message, meta) =>
    console.debug(message, createDefaultMeta(service, meta)),
  verbose: (message, meta) =>
    console.debug(message, createDefaultMeta(service, meta)),
  warn: (message, meta) =>
    console.warn(message, createDefaultMeta(service, meta)),
  error: (message, meta) =>
    console.error(message, createDefaultMeta(service, meta)),
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
