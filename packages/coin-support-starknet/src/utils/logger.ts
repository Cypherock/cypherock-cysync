import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/cysync-utils';

export const loggerServiceName = 'coin-support-starknet';

const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
};

export default logger;
