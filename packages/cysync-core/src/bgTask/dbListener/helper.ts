import { setAccounts, setWallets, store } from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

const createFuncWithErrorHandler =
  (name: string, func: () => Promise<any>) => async () => {
    try {
      await func();

      return true;
    } catch (error) {
      logger.error(`Error in ${name}`);
      logger.error(error);

      return false;
    }
  };

const syncWalletsDb = createFuncWithErrorHandler('syncWalletsDb', async () => {
  const db = getDB();

  const wallets = await db.wallet.getAll();
  store.dispatch(setWallets(wallets));
});

const syncAccountsDb = createFuncWithErrorHandler(
  'syncAccountsDb',
  async () => {
    const db = getDB();

    const accounts = await db.account.getAll();
    store.dispatch(setAccounts(accounts));
  },
);

export const syncAllDb = async () => {
  await syncAccountsDb();
  await syncWalletsDb();
};

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', syncWalletsDb);
  db.account.addListener('change', syncAccountsDb);
};

export const removeListeners = () => {
  const db = getDB();

  db.wallet.removeAllListener();
  db.account.removeAllListener();
};
