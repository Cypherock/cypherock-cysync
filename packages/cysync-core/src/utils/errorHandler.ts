import logger from './logger';

export const errorHandler = async (
  errorEvent: string | Event,
  _url?: string,
  _lineNumber?: number,
  _columnNumber?: number,
  errorObj?: Error,
  ...args: any[]
) => {
  let errorMessage = '';
  let url = _url;
  let lineNumber = _lineNumber;
  let columnNumber = _columnNumber;
  let stack = '';

  if (typeof errorEvent === 'string') {
    errorMessage = errorEvent;
  } else if (typeof (errorEvent as PromiseRejectionEvent).reason === 'string') {
    errorMessage =
      (errorEvent as PromiseRejectionEvent).reason ??
      (errorEvent as PromiseRejectionEvent).type;
  } else if ((errorEvent as PromiseRejectionEvent).reason instanceof Error) {
    errorMessage = (errorEvent as PromiseRejectionEvent).reason.message;
    stack = (errorEvent as PromiseRejectionEvent).reason.stack;
  } else if (typeof (errorEvent as ErrorEvent).message === 'string') {
    errorMessage = (errorEvent as ErrorEvent).message;
    url = (errorEvent as ErrorEvent).filename;
    lineNumber = (errorEvent as ErrorEvent).lineno;
    columnNumber = (errorEvent as ErrorEvent).colno;
  } else {
    errorMessage = JSON.stringify(errorEvent);
  }

  if (
    typeof errorEvent === 'string' &&
    errorMessage.includes('Writing to COM port')
  ) {
    logger.warn('Ignoring COM port error in error handler');
    logger.warn(errorEvent);
    return;
  }

  if (
    typeof errorEvent === 'string' &&
    errorMessage.toLowerCase().includes('ResizeObserver'.toLowerCase())
  ) {
    logger.warn('Ignoring ResizeObserver error in error handler');
    logger.warn(errorEvent);
    return;
  }

  logger.error('Error caught in error handler', {
    error: errorMessage,
    url,
    line: lineNumber,
    column: columnNumber,
    errorEvent,
    errorObj: JSON.stringify(errorObj),
    stack,
    ...args,
  });
};

export const setErrorHandler = () => {
  window.onerror = errorHandler;
  window.onunhandledrejection = errorHandler;
};
