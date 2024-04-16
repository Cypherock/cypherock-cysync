import {
  ISyncAccountsEvent,
  syncAccounts as syncAccountsCore,
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
  async ({ accounts: allAccounts, isSyncAll }, { dispatch, getState }) =>
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
      }).subscribe(observer);
    }),
);

export const syncAllAccounts =
  (): ActionCreator<void> => (dispatch, getState) => {
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
        }),
      );
    }
  };
