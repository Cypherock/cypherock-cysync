import {
  AnyAction,
  configureStore,
  Dispatch,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import {
  Provider,
  TypedUseSelectorHook,
  useSelector,
  useDispatch,
} from 'react-redux';

import accountsReducer, { IAccountsState } from './accounts';
import langReducers, { ILangState } from './lang';
import walletsReducer, { IWalletsState } from './wallets';
import accountSyncReducer, { IAccountSyncState } from './accountSync';
import networkReducer, { INetworkState } from './network';

export interface RootState {
  lang: ILangState;
  wallets: IWalletsState;
  accounts: IAccountsState;
  accountSync: IAccountSyncState;
  network: INetworkState;
}

export const store = configureStore({
  reducer: {
    lang: langReducers,
    wallets: walletsReducer,
    accounts: accountsReducer,
    accountSync: accountSyncReducer,
    network: networkReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['accounts/setAccounts'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates', 'accounts.accounts'],
      },
    }),
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
