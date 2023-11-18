import logger from './logger';

export const errorHandler = async (
  error: string | Event,
  _url?: string,
  _lineNumber?: number,
  _columnNumber?: number,
  ...args: any[]
) => {
  let errorMessage = '';
  let url = _url;
  let lineNumber = _lineNumber;
  let columnNumber = _columnNumber;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof (error as PromiseRejectionEvent).reason === 'string') {
    errorMessage =
      (error as PromiseRejectionEvent).reason ??
      (error as PromiseRejectionEvent).type;
  } else if (typeof (error as ErrorEvent).message === 'string') {
    errorMessage = (error as ErrorEvent).message;
    url = (error as ErrorEvent).filename;
    lineNumber = (error as ErrorEvent).lineno;
    columnNumber = (error as ErrorEvent).colno;
  } else {
    errorMessage = JSON.stringify(error);
  }

  if (
    typeof error === 'string' &&
    errorMessage.includes('Writing to COM port')
  ) {
    logger.warn('Ignoring COM port error in error handler');
    logger.warn(error);
    return;
  }

  if (
    typeof error === 'string' &&
    errorMessage.toLowerCase().includes('ResizeObserver'.toLowerCase())
  ) {
    logger.warn('Ignoring ResizeObserver error in error handler');
    logger.warn(error);
    return;
  }

  logger.error('Error caught in error handler', {
    error: errorMessage,
    url,
    line: lineNumber,
    column: columnNumber,
    errorEvent: error,
    ...args,
  });
};

export const setErrorHandler = () => {
  window.onerror = errorHandler;
  window.onunhandledrejection = errorHandler;
};
