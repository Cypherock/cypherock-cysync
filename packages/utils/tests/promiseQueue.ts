import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { PromiseQueue, sleep } from '../src';

const onNextMock = jest.fn();
const onErrorMock = jest.fn();
const onCompleteMock = jest.fn();

describe('PromiseQueue', () => {
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

  test('should export PromiseQueue class', async () => {
    expect(PromiseQueue).toBeDefined();
  });

  test('should run tasks in the correct order', async () => {
    const tasks = [
      jest.fn(() => Promise.resolve('Task 1')),
      jest.fn(() => Promise.resolve('Task 2')),
      jest.fn(() => Promise.resolve('Task 3')),
      jest.fn(() => Promise.resolve('Task 4')),
      jest.fn(() => Promise.resolve('Task 5')),
    ];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
    });

    const promiseRun = promiseQueue.run();

    for (let i = 0; i < 10; i += 1) {
      await jest.advanceTimersByTimeAsync(100);
    }

    await expect(promiseRun).resolves.toBeUndefined();
    expect(onNextMock).toHaveBeenNthCalledWith(1, 'Task 1');
    expect(onNextMock).toHaveBeenNthCalledWith(2, 'Task 2');
    expect(onNextMock).toHaveBeenNthCalledWith(3, 'Task 3');
    expect(onNextMock).toHaveBeenNthCalledWith(4, 'Task 4');
    expect(onNextMock).toHaveBeenNthCalledWith(5, 'Task 5');
    expect(onErrorMock).not.toHaveBeenCalled();
    expect(onCompleteMock).toHaveBeenCalled();
  });

  test('should run tasks concurrently', async () => {
    const tasks = [
      jest.fn(() => sleep(1000).then(() => 'Task 1')),
      jest.fn(() => sleep(200).then(() => 'Task 2')),
      jest.fn(() => sleep(300).then(() => 'Task 3')),
      jest.fn(() => sleep(1000).then(() => 'Task 4')),
    ];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
      checkInterval: 100,
    });

    const promiseRun = promiseQueue.run();

    for (let i = 0; i < 30; i += 1) {
      await jest.advanceTimersByTimeAsync(50);
    }

    await expect(promiseRun).resolves.toBeUndefined();
    expect(onNextMock).toHaveBeenNthCalledWith(1, 'Task 2');
    expect(onNextMock).toHaveBeenNthCalledWith(2, 'Task 3');
    expect(onNextMock).toHaveBeenNthCalledWith(3, 'Task 1');
    expect(onNextMock).toHaveBeenNthCalledWith(4, 'Task 4');
    expect(onErrorMock).not.toHaveBeenCalled();
    expect(onCompleteMock).toHaveBeenCalled();
  });

  test('should handle errors properly', async () => {
    const tasks = [
      jest.fn(() => Promise.resolve('Task 1')),
      jest.fn(() => Promise.reject(new Error('Task 2 Failed'))),
      jest.fn(() => Promise.resolve('Task 3')),
    ];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
    });

    const promiseRun = promiseQueue.run();

    for (let i = 0; i < 5; i += 1) {
      await jest.advanceTimersByTimeAsync(100);
    }

    await expect(promiseRun).resolves.toBeUndefined();
    expect(onNextMock).toHaveBeenNthCalledWith(1, 'Task 1');
    expect(onErrorMock).toHaveBeenNthCalledWith(1, new Error('Task 2 Failed'));
    expect(onNextMock).toHaveBeenNthCalledWith(2, 'Task 3');
    expect(onCompleteMock).toHaveBeenCalled();
  });

  test('should abort execution', async () => {
    const tasks = [
      jest.fn(() => sleep(100).then(() => 'Task 1')),
      jest.fn(() => sleep(100).then(() => 'Task 2')),
      jest.fn(() => sleep(100).then(() => 'Task 3')),
      jest.fn(() => sleep(100).then(() => 'Task 4')),
    ];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
    });

    const promiseRun = promiseQueue.run();

    setTimeout(() => {
      promiseQueue.abort();
    }, 150);

    for (let i = 0; i < 2; i += 1) {
      await jest.advanceTimersByTimeAsync(100);
    }

    await expect(promiseRun).resolves.toBeUndefined();
    expect(onNextMock).toHaveBeenCalledWith('Task 1');
    expect(onNextMock).toHaveBeenCalledWith('Task 2');
    expect(onNextMock).not.toHaveBeenCalledWith('Task 3');
    expect(onNextMock).not.toHaveBeenCalledWith('Task 4');
    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  test('should abort execution immediately if falsy task is encountered', async () => {
    const tasks = [
      jest.fn(() => sleep(100).then(() => 'Task 1')),
      null,
      jest.fn(() => sleep(100).then(() => 'Task 2')),
    ] as (() => Promise<string>)[];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
    });

    expect.assertions(5);

    promiseQueue.run().catch(error => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toBe('Expected function in tasks, Received: null');
    });

    await jest.advanceTimersByTimeAsync(200);

    expect(onNextMock).toHaveBeenCalledWith('Task 1');
    expect(onNextMock).not.toHaveBeenCalledWith('Task 2');
    expect(onCompleteMock).not.toHaveBeenCalled();
  });

  test('should abort execution immediately if task is not a function', async () => {
    const tasks = [
      jest.fn(() => sleep(100).then(() => 'Task 1')),
      { key: 'some value' },
      jest.fn(() => sleep(100).then(() => 'Task 2')),
    ] as (() => Promise<string>)[];

    const promiseQueue = new PromiseQueue({
      tasks,
      concurrentCount: 2,
      onNext: onNextMock,
      onError: onErrorMock,
      onComplete: onCompleteMock,
    });

    expect.assertions(5);

    promiseQueue.run().catch(error => {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toBe(
        'Expected function in tasks, Received: [object Object]',
      );
    });

    await jest.advanceTimersByTimeAsync(200);

    expect(onNextMock).toHaveBeenCalledWith('Task 1');
    expect(onNextMock).not.toHaveBeenCalledWith('Task 2');
    expect(onCompleteMock).not.toHaveBeenCalled();
  });
});
