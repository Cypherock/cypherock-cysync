import logger from '../logger';
import { memoizeFunctionWithObjectArg } from '../memoize';

export function createWorkerFunctionCaller<P, R>(param: URL | Worker) {
  let webworker: Worker;

  if (param instanceof URL) {
    webworker = new Worker(param, {
      type: 'module',
    });
  } else {
    webworker = param;
  }

  let defaultErrorHandlerError: any;

  const defaultErrorHandler = (error: any) => {
    logger.error('Default worker error handler');
    logger.error(error);
    defaultErrorHandlerError = error;
  };

  const clearListeners = () => {
    webworker.onerror = defaultErrorHandler;
    webworker.onmessageerror = null;
    webworker.onmessage = null;
  };

  clearListeners();

  return memoizeFunctionWithObjectArg(
    (params: P) =>
      new Promise<R>((resolve, reject) => {
        if (defaultErrorHandlerError) {
          reject(defaultErrorHandlerError);
          return;
        }

        webworker.onmessage = event => {
          clearListeners();
          resolve(event.data);
        };

        webworker.onerror = (...args: any[]) => {
          clearListeners();
          logger.error('Worker on Error');
          args.forEach(e => logger.error(e));
          reject(args[0]);
        };

        webworker.onmessageerror = (...args: any[]) => {
          clearListeners();
          logger.error('Worker on MessageError');
          args.forEach(e => logger.error(e));
          reject(args[0]);
        };

        webworker.postMessage({
          params,
        });
      }),
  );
}
