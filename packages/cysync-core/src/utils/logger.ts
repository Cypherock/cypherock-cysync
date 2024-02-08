import { updateLogger as updateLoggerCoinSupportUtils } from '@cypherock/coin-support-utils';
import { updateLogger as updateLoggerCoreService } from '@cypherock/cysync-core-services';
import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/cysync-utils';
import { updateLogger as updateLoggerBtc } from '@cypherock/sdk-app-btc';
import { updateLogger as updateLoggerEvm } from '@cypherock/sdk-app-evm';
import { updateLogger as updateLoggerManager } from '@cypherock/sdk-app-manager';
import { updateLogger as updateLoggerNear } from '@cypherock/sdk-app-near';
import { updateLogger as updateLoggerSolana } from '@cypherock/sdk-app-solana';
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
  updateLoggerEvm(createLogger);
  updateLoggerBtc(createLogger);
  updateLoggerSolana(createLogger);
  updateLoggerNear(createLogger);
  updateLoggerCore(createLogger);
  updateLoggerCoreService(createLogger);
  updateLoggerCoinSupportUtils(createLogger);
};

export default logger;
