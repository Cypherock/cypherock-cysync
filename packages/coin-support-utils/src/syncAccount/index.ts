import { sleep } from '@cypherock/cysync-utils';
import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import { ICreateSyncAccountsObservableParams } from './types';

import { insertOrUpdateTransactions, updateAccount } from '../db';
import logger from '../utils/logger';

export * from './types';

export function createSyncAccountsObservable<T>(
  params: ICreateSyncAccountsObservableParams<T>,
) {
  return new Observable<void>(observer => {
    let finished = false;

    const unsubscribe = () => {
      finished = true;
    };

    const main = async () => {
      try {
        const { db, accountId, waitInMSBetweenEachAPICall } = params;
        const account = await db.account.getOne({ __id: accountId });

        if (!account) {
          logger.warn(`Account not found while syncing: ${accountId}`);
          return;
        }

        let hasMore = false;

        const transactions: ITransaction[] = [];
        let nextIterationContext: T | undefined;

        let updatedAccountInfo = {};

        do {
          if (finished) break;

          const details = await params.getAddressDetails({
            ...params,
            iterationContext: nextIterationContext,
            account,
          });

          nextIterationContext = details.nextIterationContext;
          hasMore = details.hasMore;
          transactions.push(...details.transactions);
          updatedAccountInfo = {
            ...updatedAccountInfo,
            ...details.updatedAccountInfo,
          };

          if (hasMore) {
            await sleep(waitInMSBetweenEachAPICall ?? 500);
          }
        } while (hasMore);

        await updateAccount(db, accountId, updatedAccountInfo);
        await insertOrUpdateTransactions(db, transactions);

        observer.next();
        observer.complete();
      } catch (error) {
        if (!finished) {
          observer.error(error);
        }
      }
    };

    main();

    return unsubscribe;
  });
}
