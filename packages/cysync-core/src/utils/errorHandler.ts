import logger from './logger';

export const errorHandler = async (
  error: string | Event,
  url?: string,
  lineNumber?: number,
  columnNumber?: number,
) => {
  let errorMessage = '';
  if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage =
      (error as PromiseRejectionEvent).reason ?? JSON.stringify(error);
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
  });
};

export const setErrorHandler = () => {
  window.onerror = errorHandler;
  window.onunhandledrejection = errorHandler;
};
