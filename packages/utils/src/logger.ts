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

export const createLoggerWithPrefix = (logger: ILogger, name: string) => {
  const newLogger: any = { ...logger };

  for (const key of Object.keys(newLogger)) {
    newLogger[key] = (message: any, meta: any) => {
      const newMeta = {
        component: name,
        ...(meta ?? {}),
      };

      if (typeof message === 'string') {
        (logger as any)[key](`${name}: ${message}`, newMeta);
      } else {
        (logger as any)[key](message, newMeta);
      }
    };
  }

  return newLogger;
};
