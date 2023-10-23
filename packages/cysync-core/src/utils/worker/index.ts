import { memoizeFunctionWithObjectArg } from '../memoize';

export function createWorkerFunctionCaller<P, R>(url: URL) {
  const webworker = new Worker(url, {
    type: 'module',
  });

  return memoizeFunctionWithObjectArg(
    (params: P) =>
      new Promise<R>((resolve, reject) => {
        webworker.postMessage({
          params,
        });

        webworker.addEventListener('message', event => {
          resolve(event.data);
        });

        webworker.addEventListener('messageerror', error => {
          reject(error);
        });

        webworker.addEventListener('error', error => {
          reject(error.error);
        });
      }),
  );
}
