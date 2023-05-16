import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/cysync-utils';

export const loggerServiceName = 'cysync-core';

const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
};

export const createLoggerWithPrefix = (name: string) => {
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

export default logger;
