import { sleep } from './sleep';

export class PromiseQueue<T> {
  private readonly total: number;

  private completed: number;

  private readonly todo: (() => Promise<T>)[];

  private readonly running: Promise<T>[];

  private readonly concurrency: number;

  private readonly onNext: (result: T) => void;

  private readonly onError: (error: any) => void;

  private readonly onComplete: () => void;

  private isAborted: boolean;

  private readonly checkInterval: number;

  constructor(params: {
    tasks: (() => Promise<T>)[];
    concurrentCount: number;
    onNext: (result: T) => void;
    onError: (error: any) => void;
    onComplete: () => void;
    checkInterval?: number;
  }) {
    const { tasks, concurrentCount, onNext, onError, onComplete } = params;
    this.total = tasks.length;
    this.todo = tasks;
    this.completed = 0;
    this.running = [];
    this.concurrency = concurrentCount;
    this.onNext = onNext;
    this.onError = onError;
    this.onComplete = onComplete;
    this.isAborted = false;
    this.checkInterval = params.checkInterval ?? 200;
  }

  private runNext() {
    return this.running.length < this.concurrency && this.todo.length;
  }

  async run() {
    while (this.total !== this.completed) {
      if (this.isAborted) return;

      if (this.runNext()) {
        const promiseFunc = this.todo.shift();

        if (typeof promiseFunc !== 'function') {
          await Promise.allSettled(this.running);
          throw new TypeError(
            `Expected function in tasks, Received: ${promiseFunc}`,
          );
        }

        const promise = promiseFunc();

        promise
          .then(result => {
            this.onNext(result);
          })
          .catch(error => {
            this.onError(error);
          })
          .finally(() => {
            this.completed += 1;
            this.running.splice(this.running.indexOf(promise), 1);
          });

        this.running.push(promise);
      } else {
        await sleep(this.checkInterval);
      }
    }

    this.onComplete();
  }

  abort() {
    this.isAborted = true;
  }
}
