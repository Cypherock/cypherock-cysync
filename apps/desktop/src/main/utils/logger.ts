import {
  ILogger,
  LogLevel,
  LogMethod,
  LogWithServiceAndMethod,
} from '@cypherock/cysync-interfaces';
import winston from 'winston';

import { config } from './config';

const loggerConfig: Record<string, winston.transport> = {
  console: new winston.transports.Console(),
};

const transports = [loggerConfig.console];

if (config.USER_DATA_PATH) {
  loggerConfig.file = new winston.transports.File({
    filename: `${config.USER_DATA_PATH}/CySync.log`,
  });
  transports.push(loggerConfig.file);
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format(info => {
      let newInfo = { ...info };

      // If `toJSON` is present, timestamp fails to be added
      if (newInfo.toJSON) {
        delete newInfo.toJSON;
      }

      if (info instanceof Error) {
        newInfo = {
          ...newInfo,
          level: info.level,
          message: info.message,
          stack: info.stack,
        };
      }

      return newInfo;
    })(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  level: config.LOG_LEVEL ?? 'info',
  transports,
});

export const logWithServiceAndLevel: LogWithServiceAndMethod = (
  service,
  level,
  message,
  meta,
) => {
  let modifiedMeta = meta;

  // Injects default meta (service name) before logging
  if (meta && typeof meta === 'object') {
    modifiedMeta = { service, ...meta };
  } else {
    modifiedMeta = { service };
  }

  logger.log(level, message, modifiedMeta);
};

const createLogMethod =
  (service: string, level: LogLevel): LogMethod =>
  (message, meta) => {
    logWithServiceAndLevel(service, level, message, meta);
  };

export const createServiceLogger = (serviceName: string): ILogger => ({
  info: createLogMethod(serviceName, 'info'),
  error: createLogMethod(serviceName, 'error'),
  warn: createLogMethod(serviceName, 'warn'),
  debug: createLogMethod(serviceName, 'debug'),
  verbose: createLogMethod(serviceName, 'verbose'),
});

export default createServiceLogger('CySync');
