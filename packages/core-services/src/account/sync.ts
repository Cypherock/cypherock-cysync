import { getCoinSupport } from '@cypherock/coin-support';
import { PromiseQueue } from '@cypherock/cysync-utils';
import { IDatabase, IAccount, IKeyValueStore } from '@cypherock/db-interfaces';
import { lastValueFrom, Observable } from 'rxjs';

import logger from '../utils/logger';

const MAX_RETRIES = 3;
const ACCOUNT_SYNC_CONCURRENCY = 10;

export interface ISyncAccountsEvent {
  account: IAccount;
  isSuccessful: boolean;
}

export const syncSingleAccount = async (params: {
  db: IDatabase;
  account: IAccount;
  currency: string;
  keyDB?: IKeyValueStore;
}): Promise<ISyncAccountsEvent> => {
  const { db, account, currency, keyDB } = params;
  const support = getCoinSupport(account.familyId);
  let isSuccessful = false;
  let retryCount = 0;
  let error: any;

  while (!isSuccessful && retryCount < MAX_RETRIES) {
    try {
      await lastValueFrom(
        support.syncAccount({
          accountId: account.__id ?? '',
          db,
          currency,
          keyDB,
        }),
      );
      isSuccessful = true;
    } catch (e) {
      retryCount += 1;
      logger.warn(
        `Error in syncing account ${account.name} ${account.assetId}, retryCount: ${retryCount}`,
      );
      logger.warn(e);
      error = e;
    }
  }

  if (!isSuccessful && error) {
    logger.error(
      `Error in syncing account ${account.name} ${account.assetId}. Max retries exceeded `,
    );
    logger.error(error);
  }

  return { account, isSuccessful };
};

export const syncAccounts = (params: {
  db: IDatabase;
  accounts: IAccount[];
  currency: string;
  keyDB?: IKeyValueStore;
}) => {
  const { db, accounts, currency, keyDB } = params;
  return new Observable<ISyncAccountsEvent>(observer => {
    let promiseQueue: PromiseQueue<ISyncAccountsEvent> | undefined;

    const unsubscribe = () => {
      if (promiseQueue) {
        promiseQueue.abort();
      }
    };

    const main = async () => {
      try {
        promiseQueue = new PromiseQueue({
          tasks: accounts.map(
            a => () =>
              syncSingleAccount({
                account: a,
                db,
                currency,
                keyDB,
              }),
          ),
          concurrentCount: ACCOUNT_SYNC_CONCURRENCY,
          onComplete: () => {
            observer.complete();
          },
          onNext: result => {
            observer.next(result);
          },
          onError: error => {
            observer.error(error);
          },
        });

        promiseQueue.run();
      } catch (error) {
        observer.error(error);
      }
    };

    main();

    return unsubscribe;
  });
};
