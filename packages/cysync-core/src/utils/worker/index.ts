import * as uuid from 'uuid';

import logger from '../logger';
import { memoizeFunctionWithObjectArg } from '../memoize';

export interface FunctionCalls {
  resolve: (...args: any[]) => void;
  reject: (...args: any[]) => void;
  name: string;
  id: string;
}

let webworkerInstance: Worker | undefined;
let defaultErrorHandlerError: any;
let pendingFunctionCalls: FunctionCalls[] = [];

const getWebworker = () => {
  if (webworkerInstance) return webworkerInstance;
  return initWorker();
};

const initWorker = () => {
  const url = new URL('../../generated/workers/index.js', import.meta.url);

  const webworker = new Worker(url, {
    type: 'module',
  });

  webworkerInstance = webworker;

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

  webworker.onerror = (...args: any[]) => {
    clearListeners();
    logger.error('Worker on Error');
    args.forEach(e => logger.error(e));
    pendingFunctionCalls.forEach(h => h.reject(args[0]));
    pendingFunctionCalls = [];
  };

  webworker.onmessageerror = (...args: any[]) => {
    clearListeners();
    logger.error('Worker on MessageError');
    args.forEach(e => logger.error(e));
    pendingFunctionCalls.forEach(h => h.reject(args[0]));
    pendingFunctionCalls = [];
  };

  webworker.onmessage = (e: any) => {
    const { id, name, data, isError } = e.data ?? {};

    const func = pendingFunctionCalls.find(h => h.name === name && h.id === id);

    if (!func) {
      return;
    }

    if (isError) {
      func.reject(data);
    } else {
      func.resolve(data);
    }

    pendingFunctionCalls.splice(pendingFunctionCalls.indexOf(func), 1);
  };

  return webworker;
};

export function createWorkerFunctionCaller<P, R>(
  name: string,
  dontCache?: boolean,
) {
  const func = (params: P) =>
    new Promise<R>((resolve, reject) => {
      if (defaultErrorHandlerError) {
        reject(defaultErrorHandlerError);
        return;
      }

      const callId = uuid.v4();

      pendingFunctionCalls.push({
        resolve,
        reject,
        name,
        id: callId,
      });

      const webworker = getWebworker();
      webworker.postMessage({ name, params, id: callId });
    });

  if (dontCache) {
    return func;
  }
  return memoizeFunctionWithObjectArg(func);
}
