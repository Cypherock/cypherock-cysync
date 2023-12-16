import {
  syncAccounts as syncAccountsCore,
  ISyncAccountsEvent,
} from '@cypherock/cysync-core-services';
import { IAccount } from '@cypherock/db-interfaces';
import { ActionCreator, createAsyncThunk } from '@reduxjs/toolkit';
import { Observer } from 'rxjs';

import {
  AccountSyncStateMap,
  RootState,
  setAccountLastSyncedAt,
  setAccountSyncState,
  setSyncError,
  updateAccountSyncMap,
} from '~/store';
import { getDB } from '~/utils';

export const syncAccounts = createAsyncThunk<
  void,
  { accounts: IAccount[]; isSyncAll?: boolean },
  { state: RootState }
>(
  'accounts/sync',
  async ({ accounts, isSyncAll }, { dispatch, getState }) =>
    new Promise<void>(resolve => {
      if (!getState().network.active) {
        accounts.forEach(account => {
          dispatch(
            updateAccountSyncMap({
              accountId: account.__id ?? '',
              syncState: AccountSyncStateMap.failed,
            }),
          );
        });

        resolve();
        return;
      }

      dispatch(setAccountSyncState(AccountSyncStateMap.syncing));

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
          }
        },
        complete: () => {
          if (isSyncAll) {
            dispatch(setAccountLastSyncedAt(Date.now()));
          }

          dispatch(setAccountSyncState(AccountSyncStateMap.synced));
          resolve();
        },
      };

      accounts.forEach(account => {
        dispatch(
          updateAccountSyncMap({
            accountId: account.__id ?? '',
            syncState: AccountSyncStateMap.syncing,
          }),
        );
      });

      syncAccountsCore({
        db: getDB(),
        accounts,
      }).subscribe(observer);
    }),
);

export const syncAllAccounts =
  (): ActionCreator<void> => (dispatch, getState) => {
    if (!getState().network.active) {
      dispatch(setAccountSyncState(AccountSyncStateMap.failed));
      dispatch(
        setSyncError(
          getState().lang.strings.topbar.statusTexts.sync.networkErrorTooltip,
        ),
      );
    } else {
      dispatch(
        syncAccounts({
          accounts: getState().account.accounts,
          isSyncAll: true,
        }),
      );
    }
  };
