import { afterAll, afterEach, beforeAll, expect, test } from '@jest/globals';
import { ResourceLock, type GetKey } from '../src';

describe('ResourceLock', () => {
  const getKey: GetKey<string> = resource => resource;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should acquire lock immediately if no existing lock for each resource', async () => {
    const resourceLock = new ResourceLock(getKey);

    const resources = [
      { resource: 'resource1', id: 'id1' },
      { resource: 'resource2', id: 'id2' },
      { resource: 'resource3', id: 'id3' },
    ];

    const releaseLocks = await Promise.all(
      resources.map(entry => resourceLock.acquire(entry.resource, entry.id)),
    );
    const waitingIdsList = await Promise.all(
      resources.map(entry => resourceLock.getWaitingIds(entry.resource)),
    );

    releaseLocks.forEach(releaseLock =>
      expect(releaseLock).toBeInstanceOf(Function),
    );
    waitingIdsList.forEach(waitingIds => expect(waitingIds).toStrictEqual([]));
  });

  test('should acquire lock immediately if the current lock belongs to the same resource and id', async () => {
    const resourceLock = new ResourceLock(getKey);

    const resources = [
      { resource: 'resource', id: 'id' },
      { resource: 'resource', id: 'id' },
    ];

    const releaseLocks = await Promise.all(
      resources.map(entry => resourceLock.acquire(entry.resource, entry.id)),
    );
    const waitingIdsList = await Promise.all(
      resources.map(entry => resourceLock.getWaitingIds(entry.resource)),
    );

    releaseLocks.forEach(releaseLock =>
      expect(releaseLock).toBeInstanceOf(Function),
    );
    waitingIdsList.forEach(waitingIds => expect(waitingIds).toStrictEqual([]));
  });

  test('should wait and acquire lock after existing lock is released', async () => {
    const resourceLock = new ResourceLock(getKey);

    const resources = [
      { resource: 'resource', id: 'id1' },
      { resource: 'resource', id: 'id2' },
      { resource: 'resource', id: 'id3' },
      { resource: 'resource', id: 'id4' },
      { resource: 'resource', id: 'id5' },
      { resource: 'resource', id: 'id6' },
    ];

    // to valid if all checks within all then block is evaluated
    expect.assertions(resources.length * 3);

    resources.forEach((entry, i) => {
      resourceLock.acquire(entry.resource, entry.id).then(releaseLock => {
        const waitingIds = resourceLock.getWaitingIds(entry.resource);
        const nextIdsInQueue = resources
          .slice(i + 1)
          .map(resource => resource.id);
        releaseLock(); // Release the lock

        expect(releaseLock).toBeInstanceOf(Function);
        expect(waitingIds).toEqual(nextIdsInQueue);
      });

      const currentWaitingIds = resourceLock.getWaitingIds(entry.resource);
      const currentIdsInQueue = resources
        .slice(1, i + 1)
        .map(resource => resource.id);
      expect(currentWaitingIds).toEqual(currentIdsInQueue);
    });

    for (let i = 1; i < resources.length; i += 1) {
      await jest.advanceTimersByTimeAsync(100);
    }
  });

  test('should reject acquire promise after default timeout', async () => {
    // to valid if all 4 checks including catch block is evaluated
    expect.assertions(4);

    const resourceLock = new ResourceLock(getKey, { maxLockTime: 20_000 });

    await resourceLock.acquire('resource', 'id1');

    // second resource lock is waiting
    resourceLock.acquire('resource', 'id2').catch(error => {
      const waitingIds = resourceLock.getWaitingIds('resource');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Cannot aquire lock to the resource');
      expect(waitingIds).toEqual([]);
    });

    const waitingIds = resourceLock.getWaitingIds('resource');
    expect(waitingIds).toEqual(['id2']);

    await jest.advanceTimersByTimeAsync(10_000);
  });

  test('should reject acquire promise after given timeout', async () => {
    // to valid if all 4 checks including catch block is evaluated
    expect.assertions(4);

    const resourceLock = new ResourceLock(getKey);

    await resourceLock.acquire('resource', 'id1');

    // second resource lock is waiting
    resourceLock.acquire('resource', 'id2', 500).catch(error => {
      const waitingIds = resourceLock.getWaitingIds('resource');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Cannot aquire lock to the resource');
      expect(waitingIds).toEqual([]);
    });

    const waitingIds = resourceLock.getWaitingIds('resource');
    expect(waitingIds).toEqual(['id2']);

    await jest.advanceTimersByTimeAsync(10_000);
  });

  test('should use custom options', async () => {
    const errorMessage = 'Custom error message';
    const createAcquireError = jest.fn(() => new Error(errorMessage));

    const resourceLock = new ResourceLock(getKey, {
      timeout: 200,
      maxLockTime: 400,
      createAcquireError,
    });

    expect.assertions(5);

    resourceLock.acquire('resource', 'id1').then(releaseLock => {
      const waitingIds = resourceLock.getWaitingIds('resource');
      expect(releaseLock).toBeInstanceOf(Function);
      expect(waitingIds).toEqual(['id2']);
    });

    resourceLock.acquire('resource', 'id2').catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    });

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(100);

    expect(createAcquireError).toBeCalledTimes(1);
  });

  test('should release lock when release is called', async () => {
    const resourceLock = new ResourceLock(getKey);

    const resources = [
      { resource: 'resource', id: 'id1' },
      { resource: 'resource', id: 'id2' },
      { resource: 'resource', id: 'id3' },
    ];

    // to valid if all checks within all then block is evaluated
    expect.assertions(resources.length);

    resources.forEach((entry, i) => {
      resourceLock.acquire(entry.resource, entry.id).then(() => {
        const waitingIds = resourceLock.getWaitingIds(entry.resource);
        const nextIdsInQueue = resources
          .slice(i + 1)
          .map(resource => resource.id);
        resourceLock.release(entry.resource, entry.id); // Release the lock
        expect(waitingIds).toEqual(nextIdsInQueue);
      });
    });

    await jest.advanceTimersByTimeAsync(100);
  });

  test('should ignore when release lock is called with unassigned id', async () => {
    const resourceLock = new ResourceLock(getKey);
    const releaseLock = resourceLock.acquire('resource', 'id');

    expect(releaseLock).resolves.toBeInstanceOf(Function);
    expect(() => resourceLock.release('resource', 'other_id')).not.toThrow();
  });
});
