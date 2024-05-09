import { AnyAction } from '@reduxjs/toolkit';
import lodash from 'lodash';

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

async function runFunctionOrLogError<T>(func: () => Promise<T>) {
  try {
    return await func();
  } catch (error) {
    logger.error(error);
  }
}

const getAllWallets = () =>
  getDB().wallet.getAll(undefined, { sortBy: { key: 'name' } });

const syncWalletsDb = createFuncWithErrorHandler('syncWalletsDb', async () => {
  const wallets = await getAllWallets();
  store.dispatch(setWallets(wallets));
});

const getAllAccounts = () =>
  getDB().account.getAll(undefined, { sortBy: { key: 'name' } });

const syncAccountsDb = createFuncWithErrorHandler(
  'syncAccountsDb',
  async () => {
    const accounts = await getAllAccounts();
    store.dispatch(setAccounts(accounts));
  },
);

const getAllDevices = () => getDB().device.getAll();

const syncDevicesDb = createFuncWithErrorHandler('syncDevicesDb', async () => {
  const devices = await getAllDevices();
  store.dispatch(setDevices(devices));
});

const getAllPriceInfo = () => getDB().priceInfo.getAll();

const syncPriceInfosDb = createFuncWithErrorHandler(
  'syncPriceInfosDb',
  async () => {
    const priceInfos = await getAllPriceInfo();
    store.dispatch(setPriceInfos(priceInfos));
  },
);

const getAllPriceHistories = () => getDB().priceHistory.getAll();

const syncPriceHistoriesDb = createFuncWithErrorHandler(
  'syncPriceHistoriesDb',
  async () => {
    const priceHistories = await getAllPriceHistories();
    store.dispatch(setPriceHistories(priceHistories));
  },
);

const getAllTransactions = () => getDB().transaction.getAll();
const syncTransactionsDb = createFuncWithErrorHandler(
  'syncTransactionsDb',
  async () => {
    const transactions = await getAllTransactions();
    store.dispatch(setTransactions(transactions));
  },
);

export const syncAllDb = async (isFirst: boolean) => {
  const accounts = await runFunctionOrLogError(getAllAccounts);
  const wallets = await runFunctionOrLogError(getAllWallets);
  const devices = await runFunctionOrLogError(getAllDevices);
  const priceInfos = await runFunctionOrLogError(getAllPriceInfo);
  const priceHistories = await runFunctionOrLogError(getAllPriceHistories);
  const transactions = await runFunctionOrLogError(getAllTransactions);

  const allActions: AnyAction[] = [];
  if (wallets) {
    allActions.push(setWallets(wallets));
  }
  if (devices) {
    allActions.push(setDevices(devices));
  }
  if (priceInfos) {
    allActions.push(setPriceInfos(priceInfos));
  }
  if (priceHistories) {
    allActions.push(setPriceHistories(priceHistories));
  }
  if (transactions) {
    allActions.push(setTransactions(transactions));
  }
  if (accounts) {
    allActions.push(setAccounts(accounts));
  }

  if (allActions.length > 0) {
    allActions.forEach(action => store.dispatch(action));
  }

  if (accounts && isFirst) {
    if (window.cysyncEnv.IS_PRODUCTION === 'true') {
      store.dispatch(syncAccounts({ accounts, isSyncAll: true }));
    }
  }
};

const throttleDbFunction = (func: any) =>
  lodash.throttle(func, 3000, { leading: true });

export const addListeners = () => {
  const db = getDB();

  db.wallet.addListener('change', throttleDbFunction(syncWalletsDb));
  db.account.addListener('change', throttleDbFunction(syncAccountsDb));
  db.device.addListener('change', throttleDbFunction(syncDevicesDb));
  db.priceInfo.addListener('change', throttleDbFunction(syncPriceInfosDb));
  db.priceHistory.addListener(
    'change',
    throttleDbFunction(syncPriceHistoriesDb),
  );
  db.transaction.addListener('change', throttleDbFunction(syncTransactionsDb));
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
