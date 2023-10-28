import axios from 'axios';

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
  let latestError: Error | undefined;

  const DEFAULT_WAIT_TIME = 2000;

  let nextWaitTime = options?.waitInMSBetweenEachAPIRetry ?? DEFAULT_WAIT_TIME;
  const maxTries = options?.maxTries ?? 3;

  const updateNextWaitTime = (newTime?: number) => {
    nextWaitTime =
      newTime ?? options?.waitInMSBetweenEachAPIRetry ?? DEFAULT_WAIT_TIME;
  };

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
        latestError = new Error(`Max rate limit reached for API`);
        updateNextWaitTime(tries * DEFAULT_WAIT_TIME);
      } else {
        return response;
      }
    } catch (e: any) {
      tries += 1;
      latestError = e;
      doRetry = false;
    }
  } while (tries <= maxTries && doRetry);

  if (latestError) {
    throw latestError;
  }

  throw new Error('Unknown error');
};
