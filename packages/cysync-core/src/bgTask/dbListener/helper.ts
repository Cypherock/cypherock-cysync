import { syncAccounts } from '~/actions';
import {
  setAccounts,
  setDevices,
  setPriceHistories,
  setPriceInfos,
  setTransactions,
  setWallets,
  store,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

const createFuncWithErrorHandler =
  (name: string, func: (isFirst?: boolean) => Promise<any>) =>
  async (isFirst?: boolean) => {
    try {
      await func(isFirst);

      return true;
    } catch (error) {
      logger.error(`Error in ${name}`);
      logger.error(error);

      return false;
    }
  };

const syncWalletsDb = createFuncWithErrorHandler('syncWalletsDb', async () => {
  // const db = getDB();

  const wallets = [
    {
      name: 'Cypherock Red',
      hasPin: true,
      hasPassphrase: false,
      deviceId: 'abvcs',
      __id: '1jkdshfkdshfldsf',
    },
  ];
  store.dispatch(setWallets(wallets));
});

const syncAccountsDb = createFuncWithErrorHandler(
  'syncAccountsDb',
  async isFirst => {
    const db = getDB();

    const accounts = await db.account.getAll(undefined, {
      sortBy: { key: 'name' },
    });
    store.dispatch(setAccounts(accounts));

    if (isFirst) {
      store.dispatch(syncAccounts({ accounts, isSyncAll: true }));
    }
  },
);

const syncDevicesDb = createFuncWithErrorHandler('syncDevicesDb', async () => {
  const db = getDB();

  const devices = await db.device.getAll();
  store.dispatch(setDevices(devices));
});

const syncPriceInfosDb = createFuncWithErrorHandler(
  'syncPriceInfosDb',
  async () => {
    const db = getDB();

    const priceInfos = await db.priceInfo.getAll();
    store.dispatch(setPriceInfos(priceInfos));
  },
);

const syncPriceHistoriesDb = createFuncWithErrorHandler(
  'syncPriceHistoriesDb',
  async () => {
    const db = getDB();

    const priceHistories = await db.priceHistory.getAll();
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

export const syncAllDb = async (isFirst: boolean) => {
  await syncAccountsDb(isFirst);
  await syncWalletsDb();
  await syncDevicesDb();
  await syncPriceInfosDb();
  await syncPriceHistoriesDb();
  await syncTransactionsDb();
};

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', syncWalletsDb);
  db.account.addListener('change', syncAccountsDb);
  db.device.addListener('change', syncDevicesDb);
  db.priceInfo.addListener('change', syncPriceInfosDb);
  db.priceHistory.addListener('change', syncPriceHistoriesDb);
  db.transaction.addListener('change', syncTransactionsDb);
};

export const removeListeners = () => {
  const db = getDB();

  db.wallet.removeAllListener();
  db.account.removeAllListener();
  db.device.removeAllListener();
  db.priceInfo.removeAllListener();
  db.priceHistory.removeAllListener();
  db.transaction.removeAllListener();
};
