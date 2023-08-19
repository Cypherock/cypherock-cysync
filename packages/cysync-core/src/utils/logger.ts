import { updateLogger as updateLoggerCoinSupportUtils } from '@cypherock/coin-support-utils';
import { updateLogger as updateLoggerCoreService } from '@cypherock/cysync-core-services';
import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/cysync-utils';
import { updateLogger as updateLoggerManager } from '@cypherock/sdk-app-manager';
import { updateLogger as updateLoggerCore } from '@cypherock/sdk-core';

export const loggerServiceName = 'cysync-core';

const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
  updateLoggerManager(createLogger);
  updateLoggerCore(createLogger);
  updateLoggerCoreService(createLogger);
  updateLoggerCoreService(createLogger);
  updateLoggerCoinSupportUtils(createLogger);
};

export default logger;
