import axios from 'axios';
import Zod from 'zod';

import { sleep } from './sleep';

export interface MakeRequestOptions {
  maxTries?: number;
  waitInMSBetweenEachAPIRetry?: number;
}

export const makePostRequest = async (
  url: string,
  data?: Record<string, any>,
  options?: MakeRequestOptions,
) => {
  let tries = 0;
  let doRetry = false;
  let latestError: Error = new Error('Unknown error');

  const WAIT_TIME = options?.waitInMSBetweenEachAPIRetry ?? 2000;

  let nextWaitTime = WAIT_TIME;
  const maxTries = options?.maxTries ?? 3;

  do {
    try {
      if (tries > 0) {
        await sleep(nextWaitTime);
      }

      const response = await axios.post(url, data);

      if (
        response.data.message === 'NOTOK' &&
        response.data.result.toLowerCase().includes('max rate limit')
      ) {
        tries += 1;
        doRetry = true;
        latestError = new Error('Max rate limit reached for API');
        nextWaitTime = tries * WAIT_TIME;
      } else {
        return response;
      }
    } catch (e: any) {
      doRetry = false;
      if (
        e?.response?.status &&
        (e?.response?.status === 429 || e?.response?.status >= 500)
      ) {
        doRetry = true;
      }
      tries += 1;
      latestError = e;
    }
  } while (tries <= maxTries && doRetry);

  throw latestError;
};

export async function makePostRequestWithValidation<T>(
  schema: Zod.Schema<T>,
  url: string,
  data?: Record<string, any>,
  options?: MakeRequestOptions,
) {
  const response = await makePostRequest(url, data, options);
  const result = schema.parse(response.data);
  return result;
}
