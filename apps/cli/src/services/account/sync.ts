import { coinFamiliesMap } from '@cypherock/coins';
import {
  ISyncPricesEvent,
  ISyncAccountsEvent,
  syncAccounts as syncAllAccounts,
  syncPrices as syncAllPrices,
} from '@cypherock/cysync-core-services';
import { IDatabase } from '@cypherock/db-interfaces';
import colors from 'colors/safe';
import { Observer } from 'rxjs';

import { Spinner } from '~/utils';

const syncSpinnerText = 'Syncing accounts';
const syncPricesSpinnerText = 'Syncing prices';

const syncPrices = (db: IDatabase) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<void>(async (resolve, reject) => {
    const spinner = await Spinner.create(syncPricesSpinnerText);

    const families = Object.values(coinFamiliesMap);

    spinner.updateText(`${syncPricesSpinnerText} (0/${families.length})`);

    let successfulCount = 0;
    let errorCount = 0;

    const observer: Observer<ISyncPricesEvent> = {
      error: error => {
        spinner.fail();
        reject(error);
      },
      next: event => {
        if (event.isSuccessful) {
          successfulCount += 1;
        } else {
          errorCount += 1;
        }
        spinner.updateText(
          `${syncPricesSpinnerText} (${successfulCount}/${families.length}) (Failed: ${errorCount})`,
        );
      },
      complete: () => {
        spinner.succeed();
        resolve();
      },
    };

    syncAllPrices({ db, families }).subscribe(observer);
  });

export const syncAccounts = async (params: { db: IDatabase }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<void>(async (resolve, reject) => {
    console.log(colors.cyan('Starting to sync accounts'));

    const spinner = await Spinner.create(syncSpinnerText);

    const { db } = params;

    const accounts = await db.account.getAll();

    spinner.updateText(`${syncSpinnerText} (0/${accounts.length})`);

    if (accounts.length <= 0) {
      spinner.succeed();
      console.log(colors.grey('No accounts found'));
      return;
    }

    let successfulCount = 0;
    let errorCount = 0;

    const observer: Observer<ISyncAccountsEvent> = {
      error: error => {
        spinner.fail();
        reject(error);
      },
      next: event => {
        if (event.isSuccessful) {
          successfulCount += 1;
        } else {
          errorCount += 1;
        }
        spinner.updateText(
          `${syncSpinnerText} (${successfulCount}/${accounts.length}) (Failed: ${errorCount})`,
        );
      },
      complete: async () => {
        spinner.succeed();
        await syncPrices(db);
        resolve();
      },
    };

    syncAllAccounts({ db, accounts }).subscribe(observer);
  });
