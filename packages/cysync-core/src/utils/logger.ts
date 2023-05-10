import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  mergeLoggers,
} from '@cypherock/cysync-utils';
import * as evmCoinSupport from '@cypherock/coin-support-evm';

export const loggerServiceName = 'cysync-core';

const defaultLogger: ILogger = createDefaultConsoleLogger(loggerServiceName);

const logger: ILogger = {
  ...defaultLogger,
};

export const setLogger = (newLogger: ILogger) =>
  mergeLoggers({ currentLogger: logger, newLogger, defaultLogger });

export const setInternalLoggers = (createLogger: LogCreator) => {
  evmCoinSupport.setLogger(createLogger(evmCoinSupport.loggerServiceName));
};

export default logger;
