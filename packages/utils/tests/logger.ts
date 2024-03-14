import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
  createDefaultConsoleLogger,
  createLoggerWithPrefix,
  updateLoggerObject,
} from '../src';
import * as config from '../src/config';

const info = {
  message: { message: 'Info Message' },
  option: { key: 'info' },
};

const debug = {
  message: { message: 'Debug Message' },
  option: { key: 'debug' },
};

const verbose = {
  message: { message: 'Verbose Message' },
  option: { key: 'verbose' },
};

const warn = {
  message: { message: 'Warn Message' },
  option: { key: 'warn' },
};

const error = {
  message: { message: 'Error Message' },
  option: { key: 'error' },
};

jest.mock('../src/config', () => ({
  __esModule: true,
  config: {
    LOG_LEVEL: 'debug',
  },
}));

const mockedConfig = config as jest.Mocked<typeof config>;

describe('Logger', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('createDefaultConsoleLogger', () => {
    let actualConsole: Console;

    beforeAll(() => {
      actualConsole = global.console;
      console.info = jest.fn();
      console.debug = jest.fn();
      console.warn = jest.fn();
      console.error = jest.fn();
    });

    afterAll(() => {
      console.info = actualConsole.info;
      console.debug = actualConsole.debug;
      console.warn = actualConsole.warn;
      console.error = actualConsole.error;
    });

    test('should log messages with meta based on log level priority', () => {
      const logger = createDefaultConsoleLogger('test');

      logger.info(info.message, info.option);
      logger.debug(debug.message, debug.option);
      logger.verbose(verbose.message, verbose.option);
      logger.warn(warn.message, warn.option);
      logger.error(error.message, error.option);

      const logDefaultMeta = {
        service: 'test',
        timestamp: expect.any(Date),
      };

      expect(console.info).toHaveBeenCalledWith(info.message, {
        ...info.option,
        ...logDefaultMeta,
      });
      expect(console.debug).toHaveBeenNthCalledWith(1, debug.message, {
        ...debug.option,
        ...logDefaultMeta,
      });
      expect(console.debug).toHaveBeenNthCalledWith(2, verbose.message, {
        ...verbose.option,
        ...logDefaultMeta,
      });
      expect(console.warn).toHaveBeenCalledWith(warn.message, {
        ...warn.option,
        ...logDefaultMeta,
      });
      expect(console.error).toHaveBeenCalledWith(error.message, {
        ...error.option,
        ...logDefaultMeta,
      });
    });

    test('should log messages without meta based on log level priority', () => {
      const logger = createDefaultConsoleLogger('test');

      logger.info(info.message);

      const logDefaultMeta = {
        service: 'test',
        timestamp: expect.any(Date),
      };

      expect(console.info).toHaveBeenCalledWith(info.message, logDefaultMeta);
    });

    test('should not log messages with less priority than the current log level', () => {
      mockedConfig.config.LOG_LEVEL = 'warn';

      const logger = createDefaultConsoleLogger('test');

      logger.info(info.message);
      logger.error(error.message);

      expect(console.info).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    test('should default to info when LOG_LEVEL is undefined', () => {
      mockedConfig.config.LOG_LEVEL = undefined!;

      const logger = createDefaultConsoleLogger('test');

      logger.debug(debug.message, debug.option);
      logger.info(info.message, info.option);
      logger.error(error.message, error.option);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateLoggerObject', () => {
    test('should update the current logger object with the new logger object', () => {
      const currentLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      const newLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      updateLoggerObject({ newLogger, currentLogger });

      currentLogger.info(info.message, info.option);
      currentLogger.debug(debug.message, debug.option);
      currentLogger.verbose(verbose.message, verbose.option);
      currentLogger.warn(warn.message, warn.option);
      currentLogger.error(error.message, error.option);

      expect(currentLogger.info).toBeInstanceOf(Function);
      expect(currentLogger.debug).toBeInstanceOf(Function);
      expect(currentLogger.verbose).toBeInstanceOf(Function);
      expect(currentLogger.warn).toBeInstanceOf(Function);
      expect(currentLogger.error).toBeInstanceOf(Function);

      expect(newLogger.info).toHaveBeenCalledWith(info.message, info.option);
      expect(newLogger.debug).toHaveBeenCalledWith(debug.message, debug.option);
      expect(newLogger.verbose).toHaveBeenCalledWith(
        verbose.message,
        verbose.option,
      );
      expect(newLogger.warn).toHaveBeenCalledWith(warn.message, warn.option);
      expect(newLogger.error).toHaveBeenCalledWith(error.message, error.option);
    });

    test('should use toJSON for logging', () => {
      const currentLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      const newLogger = {
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      updateLoggerObject({ newLogger, currentLogger });

      const infoWithToJSON = {
        message: { toJSON: () => info.message },
        option: { toJSON: () => info.option },
      };

      currentLogger.info(infoWithToJSON.message, infoWithToJSON.option);

      expect(currentLogger.info).toBeInstanceOf(Function);
      expect(newLogger.info).toHaveBeenCalledWith(info.message, info.option);
    });
  });

  describe('createLoggerWithPrefix', () => {
    test('should create a new logger with a prefix', () => {
      const logger = {
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      const prefixedLogger = createLoggerWithPrefix(logger, 'Prefix');

      prefixedLogger.info('Test message');
      expect(logger.info).toHaveBeenCalledWith(
        'Prefix: Test message',
        expect.any(Object),
      );

      prefixedLogger.debug(debug.message);
      expect(logger.debug).toHaveBeenCalledWith(
        debug.message,
        expect.any(Object),
      );

      prefixedLogger.verbose(verbose.message, verbose.option);
      expect(logger.verbose).toHaveBeenCalledWith(
        verbose.message,
        verbose.option,
      );
    });
  });
});
