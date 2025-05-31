const {
  updateLogger: updateLoggerCoinSupportBtc,
} = require('@cypherock/coin-support-btc');
const {
  updateLogger: updateLoggerCoinSupportEvm,
} = require('@cypherock/coin-support-evm');
const {
  updateLogger: updateLoggerCoinSupportNear,
} = require('@cypherock/coin-support-near');
const {
  updateLogger: updateLoggerCoinSupportSolana,
} = require('@cypherock/coin-support-solana');
const {
  updateLogger: updateLoggerCoinSupportUtils,
} = require('@cypherock/coin-support-utils');
const {
  updateLogger: updateLoggerCoreService,
} = require('@cypherock/cysync-core-services');
import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
const {
  createDefaultConsoleLogger,
  updateLoggerObject,
} = require('@cypherock/cysync-utils');
const { updateLogger: updateLoggerBtc } = require('@cypherock/sdk-app-btc');
const { updateLogger: updateLoggerEvm } = require('@cypherock/sdk-app-evm');
const {
  updateLogger: updateLoggerManager,
} = require('@cypherock/sdk-app-manager');
const { updateLogger: updateLoggerNear } = require('@cypherock/sdk-app-near');
const {
  updateLogger: updateLoggerSolana,
} = require('@cypherock/sdk-app-solana');
const { updateLogger: updateLoggerCore } = require('@cypherock/sdk-core');

export const serviceName = 'cysync-app';

const logger: ILogger = {
  ...createDefaultConsoleLogger(serviceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(serviceName),
  });
  updateLoggerManager(createLogger);
  updateLoggerEvm(createLogger);
  updateLoggerBtc(createLogger);
  updateLoggerSolana(createLogger);
  updateLoggerNear(createLogger);
  updateLoggerCore(createLogger);
  updateLoggerCoreService(createLogger);
  updateLoggerCoinSupportUtils(createLogger);
  updateLoggerCoinSupportBtc(createLogger);
  updateLoggerCoinSupportEvm(createLogger);
  updateLoggerCoinSupportSolana(createLogger);
  updateLoggerCoinSupportNear(createLogger);
};

export const createServiceLogger = (serviceName: string): ILogger => {
  const consoleLogger = createDefaultConsoleLogger(serviceName);

  return {
    info: (message, meta) => {
      consoleLogger.info(message, meta);
    },
    debug: (message, meta) => {
      consoleLogger.debug(message, meta);
    },
    verbose: (message, meta) => {
      consoleLogger.verbose(message, meta);
    },
    warn: (message, meta) => {
      consoleLogger.warn(message, meta);
    },
    error: (message, meta) => {
      consoleLogger.error(message, meta);
    },
  };
};

export default logger;
