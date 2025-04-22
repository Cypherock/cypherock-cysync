const coreServices = require('@cypherock/cysync-core-services');
const { coinFamiliesMap } = require('@cypherock/coins');
const { getDB } = require('@/utils');

export const syncPrices = async ({ families }: { families: string[] }) => {
  return new Promise<void>(resolve => {
    const observer = {
      error: () => {
        resolve();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      next: () => {},
      complete: () => {
        resolve();
      },
    };

    coreServices
      .syncPrices({
        db: getDB(),
        families,
      })
      .subscribe(observer);
  });
};

export const syncAllPrices = () =>
  syncPrices({ families: Object.values(coinFamiliesMap) });
