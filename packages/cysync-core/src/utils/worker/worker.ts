import { setGlobalDependencies } from '~/utils/dependencies/withoutCss';

export function createWorkerFunction<P, R>(func: (params: P) => Promise<R>) {
  (globalThis as any).self.onmessage = async function (e: any) {
    setGlobalDependencies();

    postMessage(await func(e.data.params));
  };
}
