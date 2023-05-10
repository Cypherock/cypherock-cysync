export type LogMethod = (message: any, meta?: object) => void;

export interface ILogger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  verbose: LogMethod;
}

export type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

export type LogWithServiceAndMethod = (
  service: string,
  level: LogLevel,
  message: any,
  meta?: object,
) => void;

export type LogCreator = (service: string) => ILogger;
