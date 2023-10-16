import {
  ILogger,
  LogLevel,
  LogMethod,
  LogWithServiceAndMethod,
} from '@cypherock/cysync-interfaces';
import { updateLogger } from '@cypherock/database';
import winston from 'winston';

import { config } from './config';

const transports: any[] = [new winston.transports.Console()];

export const logFilePath = `${config.USER_DATA_PATH}/CySync.log`;

if (config.USER_DATA_PATH) {
  const fileConfig = new winston.transports.File({
    filename: logFilePath,
    maxsize: 10 * 1024 * 1024, // in bytes
    tailable: true,
    maxFiles: 1,
  });
  transports.push(fileConfig);
}

const rootLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors(),
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
  let modifiedMessage = message;
  let modifiedMeta = meta;

  // Injects default meta (service name) before logging
  if (meta && typeof meta === 'object') {
    modifiedMeta = { service, ...meta };
  } else {
    modifiedMeta = { service };
  }

  // If message is object
  if (message && typeof message === 'object') {
    let messageJson = message;
    if (message.toJSON) {
      messageJson = message.toJSON();
    }

    modifiedMeta = { ...messageJson, ...modifiedMeta, message: undefined };
    modifiedMessage = messageJson.message;
  }

  rootLogger.log(level, modifiedMessage, modifiedMeta);
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
