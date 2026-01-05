import {
  ISyncAccountsEvent,
  syncAccounts as syncAccountsCore,
} from '@cypherock/cysync-core-services';
import { coinFamiliesMap } from '@cypherock/coins';
import { HttpStatusCode } from 'axios';
import {
  IAccount,
  SwapStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { ActionCreator, createAsyncThunk } from '@reduxjs/toolkit';
import { Observer } from 'rxjs';

import { getExchangeStatus } from '~/services/swapService';
import {
  AccountSyncStateMap,
  RootState,
  setAccountLastSyncedAt,
  setAccountSyncState,
  setSyncError,
  updateAccountSyncMap,
} from '~/store';
import {
  selectIsSyncPrompted,
  setCantonUnauthorizedSyncError,
  setIsSyncPrompted,
} from '~/store/canton';
import { getDB, getKeyDB } from '~/utils';
import { openSyncCantonAccountPromptDialog } from '..';

const updateSwapReceiveTransactions = async () => {
  const db = getDB();
  const swapSendTransactions = await db.transaction.getAll({
    isSwap: true,
    type: TransactionTypeMap.send,
    status: TransactionStatusMap.success,
  });
  for (const txn of swapSendTransactions) {
    if (!txn.swapData) continue;

    const { providerId, swapId: exchangeId, isReceiveUpdated } = txn.swapData;

    if (isReceiveUpdated) continue;

    let { payoutTxnHash, swapStatus } = txn.swapData;

    if (swapStatus === SwapStatus.Pending) {
      const { status, data } = await getExchangeStatus({
        providerId,
        exchangeId,
      });
      if (status === 200) {
        const exchangeStatus = data.data.status;
        if (exchangeStatus === 'finished') {
          swapStatus = SwapStatus.Success;
          payoutTxnHash = payoutTxnHash ?? data.data.payoutHash;
        } else if (exchangeStatus === 'failed') {
          swapStatus = SwapStatus.Failed;
        } else if (exchangeStatus === 'hold') {
          swapStatus = SwapStatus.Hold;
        } else if (exchangeStatus === 'expired') {
          swapStatus = SwapStatus.Expired;
        }
      }
    } else if (
      swapStatus === SwapStatus.Failed ||
      swapStatus === SwapStatus.Expired
    ) {
      continue;
    }

    const swapData = {
      ...txn.swapData,
      swapStatus,
      payoutTxnHash,
      isReceiveUpdated: !!payoutTxnHash,
    };

    if (payoutTxnHash) {
      await db.transaction.update(
        { hash: payoutTxnHash, type: TransactionTypeMap.receive },
        {
          isSwap: true,
          swapData,
        },
      );
    }

    await db.transaction.update(
      { __id: txn.__id },
      {
        swapData,
      },
    );
  }
};

export const syncAccounts = createAsyncThunk<
  void,
  { accounts: IAccount[]; isSyncAll?: boolean; currency: string },
  { state: RootState }
>(
  'accounts/sync',
  async (
    { accounts: allAccounts, isSyncAll, currency },
    { dispatch, getState },
  ) =>
    new Promise<void>(resolve => {
      const unhiddenAccounts = allAccounts.filter(a => !a.isHidden);

      if (!getState().network.active) {
        unhiddenAccounts.forEach(account => {
          dispatch(
            updateAccountSyncMap({
              accountId: account.__id ?? '',
              syncState: AccountSyncStateMap.failed,
            }),
          );
        });

        if (isSyncAll) {
          dispatch(setAccountLastSyncedAt(Date.now()));
        }

        resolve();
        return;
      }

      dispatch(setAccountSyncState(AccountSyncStateMap.syncing));
      dispatch(setSyncError(undefined));

      const observer: Observer<ISyncAccountsEvent> = {
        error: () => {
          if (isSyncAll) {
            dispatch(setAccountLastSyncedAt(Date.now()));
          }

          dispatch(setAccountSyncState(AccountSyncStateMap.failed));
          resolve();
        },
        next: event => {
          dispatch(setAccountSyncState(AccountSyncStateMap.syncing));

          if (event.isSuccessful) {
            dispatch(
              updateAccountSyncMap({
                accountId: event.account.__id ?? '',
                syncState: AccountSyncStateMap.synced,
              }),
            );
          } else {
            dispatch(
              updateAccountSyncMap({
                accountId: event.account.__id ?? '',
                syncState: AccountSyncStateMap.failed,
              }),
            );

            if (
              event.account.familyId === coinFamiliesMap.canton &&
              event.error?.response?.status === HttpStatusCode.Unauthorized
            ) {
              dispatch(setCantonUnauthorizedSyncError({ hasError: true }));
              if (!selectIsSyncPrompted(getState())) {
                dispatch(openSyncCantonAccountPromptDialog());
                dispatch(setIsSyncPrompted({ isPrompted: true }));
              }
            }
          }
        },
        complete: () => {
          if (isSyncAll) {
            dispatch(setAccountLastSyncedAt(Date.now()));
          }

          dispatch(setAccountSyncState(AccountSyncStateMap.synced));
          updateSwapReceiveTransactions();
          resolve();
        },
      };

      unhiddenAccounts.forEach(account => {
        dispatch(
          updateAccountSyncMap({
            accountId: account.__id ?? '',
            syncState: AccountSyncStateMap.syncing,
          }),
        );
      });

      syncAccountsCore({
        db: getDB(),
        accounts: unhiddenAccounts,
        currency,
        keyDB: getKeyDB(),
      }).subscribe(observer);
    }),
);

export const syncAllAccounts =
  (currency: string): ActionCreator<void> =>
  (dispatch, getState) => {
    if (!getState().network.active) {
      dispatch(
        setSyncError(
          getState().lang.strings.topbar.statusTexts.sync.networkErrorTooltip,
        ),
      );
      dispatch(setAccountLastSyncedAt(Date.now()));
    } else {
      dispatch(setSyncError(undefined));
      dispatch(
        syncAccounts({
          accounts: getState().account.accounts,
          isSyncAll: true,
          currency,
        }),
      );
    }
  };
