import { sleep } from './sleep';

export const waitIfIntervalExceeded = async (
  startTime: number,
  interval = 100,
  waitTime = 20,
) => {
  if (startTime + interval < Date.now()) {
    await sleep(waitTime);

    return Date.now();
  }

  return startTime;
};
