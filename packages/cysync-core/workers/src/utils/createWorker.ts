import { setGlobalDependencies } from './dependencies';

export function createWorkerFunction<P, R>(func: (params: P) => Promise<R>) {
  console.log('Creating worker func', func);
  (globalThis as any).self.onmessage = async function (e: any) {
    setGlobalDependencies();

    postMessage(await func(e.data.params));
  };
}
