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
import { INetworkState } from './network';

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
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
