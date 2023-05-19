import {
  ILogger,
  LogLevel,
  LogMethod,
  LogWithServiceAndMethod,
} from '@cypherock/cysync-interfaces';
import winston from 'winston';

import { updateLogger } from '@cypherock/database';
import { config } from './config';

const transports: any[] = [new winston.transports.Console()];

if (config.USER_DATA_PATH) {
  const fileConfig = new winston.transports.File({
    filename: `${config.USER_DATA_PATH}/CySync.log`,
    maxsize: 10 * 1024 * 1024, // in bytes
    tailable: true,
    maxFiles: 1,
  });
  transports.push(fileConfig);
}

const rootLogger = winston.createLogger({
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
  level: config.LOG_LEVEL,
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

  rootLogger.log(level, message, modifiedMeta);
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

updateLogger(createServiceLogger);

export const logger = createServiceLogger('CySync');
