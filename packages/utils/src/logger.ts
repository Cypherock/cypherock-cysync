import { ILogger } from '@cypherock/cysync-interfaces';

import { config } from './config';

const logLevelPriority: Record<string, number | undefined> = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
};

const doLog = (level: string) => {
  const currentPriority = logLevelPriority[level];
  const allowedPriority = logLevelPriority[config.LOG_LEVEL] ?? 2;

  if (currentPriority === undefined) {
    return false;
  }

  return allowedPriority >= currentPriority;
};

const createDefaultMeta = (service: string, meta: any) => ({
  service,
  ...(meta ?? {}),
  timestamp: new Date(),
});

export const createDefaultConsoleLogger = (service: string): ILogger => ({
  info: (message, meta) =>
    doLog('info') && console.info(message, createDefaultMeta(service, meta)),
  debug: (message, meta) =>
    doLog('debug') && console.debug(message, createDefaultMeta(service, meta)),
  verbose: (message, meta) =>
    doLog('verbose') &&
    console.debug(message, createDefaultMeta(service, meta)),
  warn: (message, meta) =>
    doLog('warn') && console.warn(message, createDefaultMeta(service, meta)),
  error: (message, meta) =>
    doLog('error') && console.error(message, createDefaultMeta(service, meta)),
});

export const updateLoggerObject = (params: {
  newLogger: ILogger;
  currentLogger: ILogger;
}) => {
  const { newLogger, currentLogger } = params;

  for (const key in newLogger) {
    if ((newLogger as any)[key]) {
      (currentLogger as any)[key] = (message: any, meta: any) => {
        let newMessage = message;
        let newMeta = meta;

        if (message && typeof message === 'object' && message.toJSON) {
          newMessage = message.toJSON();
        }

        if (meta && typeof meta === 'object' && meta.toJSON) {
          newMeta = meta.toJSON();
        }

        (newLogger as any)[key](newMessage, newMeta);
      };
    }
  }
};

export const createLoggerWithPrefix = (logger: ILogger, name: string) => {
  const newLogger: any = { ...logger };

  for (const key of Object.keys(newLogger)) {
    newLogger[key] = (message: any, meta: any) => {
      const newMeta = meta ?? {};
      newMeta.component = name;

      if (typeof message === 'string') {
        (logger as any)[key](`${name}: ${message}`, newMeta);
      } else {
        (logger as any)[key](message, newMeta);
      }
    };
  }

  return newLogger;
};
