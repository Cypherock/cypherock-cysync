import { syncAccounts } from '@/actions';
import { keyValueStore } from '@/db';
import { setAccounts, setLanguage, setWallets, store } from '@/store';
import { getDB } from '@/utils';
import throttle from 'lodash/throttle';

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

export const syncAllDb = async (isFirst: boolean) => {
  await syncAccountsDb(isFirst);
  await syncWalletsDb();

  store.dispatch(setLanguage((await keyValueStore.appLanguage.get()) as any));
};

const throttleDbFunction = (func: any) =>
  throttle(func, 3000, { leading: true });

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', throttleDbFunction(syncWalletsDb));
  db.account.addListener('change', throttleDbFunction(syncAccountsDb));
};

export const removeListeners = () => {
  const db = getDB();

  db.wallet.removeAllListener();
  db.account.removeAllListener();
};
