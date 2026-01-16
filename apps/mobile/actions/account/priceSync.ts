const coreServices = require('@cypherock/cysync-core-services');
const { coinFamiliesMap } = require('@cypherock/coins');
const { getDB } = require('@/utils');

export const syncPrices = async ({
  families,
  currency,
}: {
  families: string[];
  currency: string;
}) => {
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
        currency,
      })
      .subscribe(observer);
  });
};

export const syncAllPrices = (currency: string) =>
  syncPrices({ families: Object.values(coinFamiliesMap), currency });
