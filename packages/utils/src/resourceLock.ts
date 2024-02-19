const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RECHECK_TIME = 100;
const MAX_LOCK_TIME = 10 * 1000;

const defaultCreateAcquireError = () =>
  new Error('Cannot aquire lock to the resource');

interface ILock {
  id: string;
  at: number;
}

export type GetKey<T> = (resouce: T) => string;

export interface ResourceLockOptions {
  timeout?: number;
  maxLockTime?: number;
  createAcquireError?: () => Error;
}

export class ResourceLock<T> {
  private waitingLockMap: Record<string, string[] | undefined> = {};

  private lockMap: Record<string, ILock | undefined> = {};

  private readonly getKey: GetKey<T>;

  private readonly timeout: number;

  private readonly maxLockTime: number;

  private readonly createAcquireError: () => Error;

  constructor(getKey: GetKey<T>, options?: ResourceLockOptions) {
    this.getKey = getKey;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    this.maxLockTime = options?.maxLockTime ?? MAX_LOCK_TIME;
    this.createAcquireError =
      options?.createAcquireError ?? defaultCreateAcquireError;
  }

  private readonly getLockId = (resource: T) => {
    const key = this.getKey(resource);

    const lock = this.lockMap[key];

    if (lock) {
      const isValidLock = lock.at + this.maxLockTime > Date.now();
      if (isValidLock) {
        return lock.id;
      }
    }

    return undefined;
  };

  private readonly addLock = (resource: T, id: string) => {
    this.lockMap[this.getKey(resource)] = { id, at: Date.now() };
  };

  private readonly addWaitingId = (resource: T, id: string) => {
    const waitingIds = this.waitingLockMap[this.getKey(resource)];
    if (!waitingIds) {
      this.waitingLockMap[this.getKey(resource)] = [id];
    } else {
      waitingIds.push(id);
    }
  };

  private readonly removeWaitingId = (resource: T, id: string) => {
    const waitingIds = this.waitingLockMap[this.getKey(resource)];
    if (!waitingIds) {
      return;
    }

    waitingIds.splice(waitingIds.indexOf(id), 1);
  };

  public acquire = (
    resource: T,
    id: string,
    timeout?: number,
  ): Promise<() => void> =>
    new Promise((resolve, reject) => {
      let timeoutId: any;

      const releaseLock = () => {
        const lock = this.getLockId(resource);

        if (lock === id) {
          this.forceRelease(resource);
        }
      };

      const lock = this.getLockId(resource);
      if (!lock || lock === id) {
        this.addLock(resource, id);
        resolve(releaseLock);
        return;
      }

      this.addWaitingId(resource, id);

      const maxRecheckTime = Date.now() + (timeout ?? this.timeout);

      const recheck = () => {
        const lockId = this.getLockId(resource);
        if (!lockId || lockId === id) {
          this.addLock(resource, id);
          this.removeWaitingId(resource, id);
          resolve(releaseLock);
          return;
        }

        if (Date.now() >= maxRecheckTime) {
          clearTimeout(timeoutId);
          this.removeWaitingId(resource, id);
          reject(this.createAcquireError());
        } else {
          timeoutId = setTimeout(recheck, DEFAULT_RECHECK_TIME);
        }
      };

      timeoutId = setTimeout(recheck, DEFAULT_RECHECK_TIME);
    });

  public release = (resource: T, id: string) => {
    const lock = this.getLockId(resource);

    if (lock && lock !== id) {
      return;
    }

    this.forceRelease(resource);
  };

  public forceRelease = (resource: T) => {
    this.lockMap[this.getKey(resource)] = undefined;
  };

  public getWaitingIds = (resource: T) => [
    ...(this.waitingLockMap[this.getKey(resource)] ?? []),
  ];
}
