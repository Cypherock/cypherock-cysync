import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import axios from 'axios';

import { makePostRequest } from '../src';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn<any>(),
  },
}));

describe('makePostRequest', () => {
  const url = 'https://example.com/api';
  const data = { key: 'value' };
  const successResponse = { data: { message: 'OK', result: 'Success' } };
  const errorResponse = {
    data: { message: 'NOTOK', result: 'Max rate limit' },
  };

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

  test('should export makePostRequest function', () => {
    expect(makePostRequest).toBeInstanceOf(Function);
  });

  test('should make a successful request on the first try', async () => {
    mockedAxios.post.mockResolvedValueOnce(successResponse);

    await expect(makePostRequest(url, data)).resolves.toStrictEqual(
      successResponse,
    );
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
  });

  test('should make a successful request on the second try', async () => {
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(successResponse);

    const request = makePostRequest(url, data);

    await jest.advanceTimersByTimeAsync(2000);

    await expect(request).resolves.toStrictEqual(successResponse);
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
  });

  test('should make a successful request on the third try', async () => {
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(successResponse);

    const request = makePostRequest(url, data);

    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(4000);

    await expect(request).resolves.toStrictEqual(successResponse);
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
  });

  test('should make a successful request on the fourth try', async () => {
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(successResponse);

    const request = makePostRequest(url, data);

    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(4000);
    await jest.advanceTimersByTimeAsync(6000);

    await expect(request).resolves.toStrictEqual(successResponse);
    expect(mockedAxios.post).toHaveBeenCalledTimes(4);
    expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
  });

  test('should throw an error after four failed requests', async () => {
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);

    // to valid if all 4 checks within catch block is evaluated
    expect.assertions(4);

    makePostRequest(url, data).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Max rate limit reached for API');
      expect(mockedAxios.post).toHaveBeenCalledTimes(4);
      expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
    });

    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(4000);
    await jest.advanceTimersByTimeAsync(6000);
  });

  test('should use options params', async () => {
    mockedAxios.post.mockResolvedValueOnce(errorResponse);
    mockedAxios.post.mockResolvedValueOnce(errorResponse);

    const waitInMSBetweenEachAPIRetry = 100;

    // to valid if all 4 checks within catch block is evaluated
    expect.assertions(4);

    makePostRequest(url, data, {
      maxTries: 1,
      waitInMSBetweenEachAPIRetry,
    }).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Max rate limit reached for API');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
    });

    await jest.advanceTimersByTimeAsync(waitInMSBetweenEachAPIRetry);
  });

  test('should handle unexpected error', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(networkError);

    // to valid if all 4 checks within catch block is evaluated
    expect.assertions(4);

    makePostRequest(url, data).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(networkError.message);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
    });
  });

  test('should handle invalid response', async () => {
    mockedAxios.post.mockResolvedValueOnce('some unknown response');

    // to valid if all 3 checks within catch block is evaluated
    expect.assertions(3);

    makePostRequest(url, data).catch(error => {
      expect(error).toBeInstanceOf(Error);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(url, data);
    });
  });
});
