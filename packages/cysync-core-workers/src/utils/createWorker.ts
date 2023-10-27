export function createWorkerFunction<P, R>(func: (params: P) => Promise<R>) {
  (globalThis as any).self.onmessage = async function (e: any) {
    postMessage(await func(e.data.params));
  };
}
