import {
  syncAccounts,
  ISyncAccountsEvent,
} from '@cypherock/cysync-core-services';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Observer } from 'rxjs';

import {
  AccountSyncStateMap,
  RootState,
  setAccountSyncState,
  updateAccountSyncMap,
} from '~/store';
import { getDB } from '~/utils';

export const startAccountSyncing = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'accounts/sync',
  async (_, { dispatch, getState }) =>
    new Promise<void>(resolve => {
      const state = getState();

      if (state.accountSync.syncState === AccountSyncStateMap.syncing) {
        resolve();
        return;
      }

      dispatch(setAccountSyncState(AccountSyncStateMap.syncing));

      const observer: Observer<ISyncAccountsEvent> = {
        error: () => {
          dispatch(setAccountSyncState(AccountSyncStateMap.failed));
          resolve();
        },
        next: event => {
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
          dispatch(setAccountSyncState(AccountSyncStateMap.synced));
          resolve();
        },
      };

      state.account.accounts.forEach(account => {
        dispatch(
          updateAccountSyncMap({
            accountId: account.__id ?? '',
            syncState: AccountSyncStateMap.syncing,
          }),
        );
      });

      syncAccounts({
        db: getDB(),
        accounts: state.account.accounts,
      }).subscribe(observer);
    }),
);
