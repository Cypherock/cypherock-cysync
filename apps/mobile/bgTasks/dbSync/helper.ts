import { syncAccounts } from '@/actions';
import { keyValueStore } from '@/db';
import {
  setAccounts,
  setLanguage,
  setPriceHistories,
  setPriceInfos,
  setWallets,
  store,
} from '@/store';
import { setTransactions } from '@/store/transaction';
import { getDB } from '@/utils';
import { throttle } from 'lodash';

const createFuncWithErrorHandler =
  (name: string, func: (isFirst?: boolean) => Promise<any>) =>
  async (isFirst?: boolean) => {
    try {
      await func(isFirst);

      return true;
    } catch (error) {
      console.log(`Error in ${name}`);
      console.log(error);

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

export const syncAccountsDb = createFuncWithErrorHandler(
  'syncAccountsDb',
  async isFirst => {
    const db = getDB();

    const accounts = await db.account.getAll(undefined, {
      sortBy: { key: 'name' },
    });
    store.dispatch(setAccounts(accounts));

    if (isFirst === true) {
      store.dispatch(syncAccounts({ accounts, isSyncAll: true }) as any);
    }
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

export const syncAllDb = async () => {
  await syncAccountsDb();
  await syncWalletsDb();
  await syncTransactionsDb();
  await syncPriceInfosDb();
  await syncPriceHistoriesDb();

  store.dispatch(setLanguage((await keyValueStore.appLanguage.get()) as any));
};

const throttleDbFunction = (func: any) =>
  throttle(func, 3000, { leading: true });

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', throttleDbFunction(syncWalletsDb));
  db.account.addListener('change', throttleDbFunction(syncAccountsDb));
  db.transaction.addListener('change', throttleDbFunction(syncTransactionsDb));
};

export const removeListeners = () => {
  const db = getDB();

  db.wallet.removeAllListener();
  db.account.removeAllListener();
  db.transaction.removeAllListener();
};
