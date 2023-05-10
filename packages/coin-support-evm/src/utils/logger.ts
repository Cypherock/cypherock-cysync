import { ILogger } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  mergeLoggers,
} from '@cypherock/cysync-utils';

export const loggerServiceName = 'coin-support-evm';

const defaultLogger: ILogger = createDefaultConsoleLogger(loggerServiceName);

const logger: ILogger = {
  ...defaultLogger,
};

export const setLogger = (newLogger: ILogger) =>
  mergeLoggers({ currentLogger: logger, newLogger, defaultLogger });

export default logger;
