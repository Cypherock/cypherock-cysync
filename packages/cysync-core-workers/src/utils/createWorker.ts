export interface IHandler {
  name: string;
  func: (params: any) => Promise<any>;
}

const globalHandlers: IHandler[] = [];

export const initWorker = () => {
  (globalThis as any).self.onmessage = async function (e: any) {
    const { id, name } = e.data ?? {};
    const func = globalHandlers.find(h => h.name === name)?.func;

    if (!func) return;

    try {
      postMessage({ name, data: await func(e.data.params), id });
    } catch (error) {
      postMessage({ name, data: error, isError: true, id });
    }
  };
};

export function addWorkerHandlers(handlers: IHandler[]) {
  globalHandlers.push(...handlers);
}
