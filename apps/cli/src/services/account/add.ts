import { getCoinSupport } from '@cypherock/coin-support';
import { ICreateAccountEvent } from '@cypherock/coin-support-interfaces';
import { coinList, ICoinInfo } from '@cypherock/coins';
import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Observer, Subscription } from 'rxjs';

import { queryCheckbox, querySelect, Spinner } from '~/utils';

import { formatAccountDisplay, queryWallet } from '../helpers';

const deviceSpinnerText = 'Getting keys from device';
const syncSpinnerText = 'Getting account information';

const queryCoinSelection = async () => {
  const list = Object.values(coinList).map(c => ({
    name: c.name,
    value: c.id,
  }));

  const selectedId = await querySelect(list, 'Select coin');

  return coinList[selectedId];
};

const queryAccountSelection = async (accounts: IAccount[]) => {
  const list = Object.values(accounts).map(a => ({
    name: formatAccountDisplay(a),
    value: a,
  }));

  return queryCheckbox(list, 'Select accounts you want to add');
};

const getNewAccounts = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
  coin: ICoinInfo;
  walletId: string;
}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<IAccount[]>(async (resolve, reject) => {
    let subscription: Subscription | undefined;

    try {
      const { db, connection, coin, walletId } = params;

      const coinSupport = getCoinSupport(coin.family);
      const accounts: IAccount[] = [];
      const deviceSpinner = await Spinner.create(deviceSpinnerText);
      let syncSpinner: Spinner | undefined;

      const observer: Observer<ICreateAccountEvent> = {
        complete: () => {
          syncSpinner?.succeed();
          resolve(accounts);
        },
        next: async value => {
          if (value.device?.isDone) {
            deviceSpinner.succeed();
            syncSpinner = await Spinner.create(syncSpinnerText);
          }

          if (value.account) {
            accounts.push(value.account);
            syncSpinner?.updateText(
              `${syncSpinnerText}: Found ${accounts.length} account(s)`,
            );
          }
        },
        error: error => {
          if (!deviceSpinner.isCompleted) {
            deviceSpinner.fail();
          }

          if (syncSpinner && !syncSpinner.isCompleted) {
            syncSpinner.fail();
          }

          reject(error);
        },
      };

      subscription = coinSupport
        .createAccounts({
          coinId: coin.id,
          connection,
          db,
          walletId,
        })
        .subscribe(observer);
    } catch (error) {
      if (subscription) {
        subscription.unsubscribe();
      }

      reject(error);
    }
  });

export const addAccount = async (params: {
  db: IDatabase;
  connection: IDeviceConnection;
}) => {
  const { db, connection } = params;

  const selectedWallet = await queryWallet(
    db,
    'Select a wallet to add account',
  );

  const selectedCoin = await queryCoinSelection();

  const newAccounts = await getNewAccounts({
    db,
    connection,
    coin: selectedCoin,
    walletId: selectedWallet.__id,
  });

  if (newAccounts.length <= 0) {
    throw new Error('No new accounts found');
  }

  const selectedAccounts = await queryAccountSelection(newAccounts);

  if (selectedAccounts.length <= 0) {
    throw new Error('No accounts selected');
  }

  await db.account.insert(selectedAccounts);
};
