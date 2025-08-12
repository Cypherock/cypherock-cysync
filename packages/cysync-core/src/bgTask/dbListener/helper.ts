import lodash from 'lodash';

import { syncAccounts } from '~/actions';
import {
  setAccounts,
  setDevices,
  setInheritancePlans,
  setLanguage,
  setPriceHistories,
  setPriceInfos,
  setTransactions,
  setWallets,
  store,
} from '~/store';
import { getDB, keyValueStore } from '~/utils';
import logger from '~/utils/logger';

const createFuncWithErrorHandler =
  (
    name: string,
    func: (isFirst?: boolean, currency?: string) => Promise<any>,
  ) =>
  async (isFirst?: boolean, currency?: string) => {
    try {
      await func(isFirst, currency);

      return true;
    } catch (error) {
      logger.error(`Error in ${name}`);
      logger.error(error);

      return false;
    }
  };

const syncWalletsDb = createFuncWithErrorHandler('syncWalletsDb', async () => {
  const db = getDB();

  const wallets = await db.wallet.getAll(undefined, {
    sortBy: { key: 'name' },
  });
  store.dispatch(setWallets(wallets));
});

const syncAccountsDb = createFuncWithErrorHandler(
  'syncAccountsDb',
  async (isFirst, currency) => {
    const db = getDB();

    const accounts = await db.account.getAll(undefined, {
      sortBy: { key: 'name' },
    });
    store.dispatch(setAccounts(accounts));

    if (isFirst && currency) {
      if (window.cysyncEnv.IS_PRODUCTION === 'true') {
        store.dispatch(syncAccounts({ accounts, isSyncAll: true, currency }));
      }
    }
  },
);

const syncDevicesDb = createFuncWithErrorHandler('syncDevicesDb', async () => {
  const db = getDB();

  const devices = await db.device.getAll();
  store.dispatch(setDevices(devices));
});

let lastPriceInfosVersion = 0;
const computePriceInfosVersion = (list: any[]) =>
  list.reduce((acc, p) => acc + (p.lastSyncedAt ?? 0), 0);

const syncPriceInfosDb = createFuncWithErrorHandler(
  'syncPriceInfosDb',
  async (_isFirst?: boolean, currency?: string) => {
    const db = getDB();

    const priceInfos = currency
      ? await db.priceInfo.getAll([{ currency } as any])
      : await db.priceInfo.getAll();
    const version = computePriceInfosVersion(priceInfos);
    if (version === lastPriceInfosVersion) return;
    lastPriceInfosVersion = version;
    store.dispatch(setPriceInfos(priceInfos));
  },
);

let lastPriceHistoriesVersion = 0;
const computePriceHistoriesVersion = (list: any[]) =>
  list.reduce(
    (acc, h) => acc + (h.days ?? 0) + (h.history?.[0]?.timestamp ?? 0),
    0,
  );

const syncPriceHistoriesDb = createFuncWithErrorHandler(
  'syncPriceHistoriesDb',
  async (_isFirst?: boolean, currency?: string) => {
    const db = getDB();

    const priceHistories = currency
      ? await db.priceHistory.getAll([{ currency } as any])
      : await db.priceHistory.getAll();
    const version = computePriceHistoriesVersion(priceHistories);
    if (version === lastPriceHistoriesVersion) return;
    lastPriceHistoriesVersion = version;
    store.dispatch(setPriceHistories(priceHistories));
  },
);

const syncTransactionsDb = createFuncWithErrorHandler(
  'syncTransactionsDb',
  async () => {
    const db = getDB();

    const transactions = await db.transaction.getAll();
    store.dispatch(setTransactions(transactions));
  },
);

const syncInheritancePlanDb = createFuncWithErrorHandler(
  'syncInheritancePlanDb',
  async () => {
    const db = getDB();

    // TODO: Unhide pending plans in future when handling is complete
    const plans = (await db.inheritancePlan.getAll()).filter(
      p => !!(p.expireAt && p.purchasedAt),
    );
    store.dispatch(setInheritancePlans(plans));
  },
);

export const syncAllDb = async (isFirst: boolean, currency: string) => {
  await syncAccountsDb(isFirst, currency);
  await syncWalletsDb();
  await syncDevicesDb();
  await syncPriceInfosDb(isFirst, currency);
  await syncPriceHistoriesDb(isFirst, currency);
  await syncTransactionsDb();
  await syncInheritancePlanDb();

  store.dispatch(setLanguage((await keyValueStore.appLanguage.get()) as any));
};

const throttleDbFunction = (func: any) =>
  lodash.throttle(func, 3000, { leading: true });

const debounceDbFunction = (func: any, wait = 1500) =>
  lodash.debounce(func, wait);

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', throttleDbFunction(syncWalletsDb));
  db.account.addListener('change', throttleDbFunction(syncAccountsDb));
  db.device.addListener('change', throttleDbFunction(syncDevicesDb));
  db.transaction.addListener('change', throttleDbFunction(syncTransactionsDb));
  db.inheritancePlan.addListener(
    'change',
    throttleDbFunction(syncInheritancePlanDb),
  );
};

export const removeListeners = () => {
  const db = getDB();

  db.wallet.removeAllListener();
  db.account.removeAllListener();
  db.device.removeAllListener();
  db.transaction.removeAllListener();
  db.inheritancePlan.removeAllListener();
};

export const syncPriceDataDb = async (currency?: string) => {
  await syncPriceInfosDb(false, currency);
  await syncPriceHistoriesDb(false, currency);
};

export const addPriceListeners = (currency?: string) => {
  const db = getDB();
  db.priceInfo.addListener(
    'change',
    debounceDbFunction(() => syncPriceInfosDb(false, currency)),
  );
  db.priceHistory.addListener(
    'change',
    debounceDbFunction(() => syncPriceHistoriesDb(false, currency)),
  );
};

export const removePriceListeners = () => {
  const db = getDB();
  db.priceInfo.removeAllListener();
  db.priceHistory.removeAllListener();
};
