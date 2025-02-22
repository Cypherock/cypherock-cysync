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
import transactionsReducer, { ITransactionState } from './transaction';
import priceInfoReducer, { IPriceInfoState } from './priceInfo';
import priceHistoryReducer, { IPriceHistoryState } from './priceHistory';
import notificationReducer, { INotificationState } from './notification';

export interface RootState {
  lang: ILangState;
  wallets: IWalletsState;
  accounts: IAccountsState;
  transactions: ITransactionState;
  accountSync: IAccountSyncState;
  priceInfo: IPriceInfoState;
  priceHistory: IPriceHistoryState;
  network: INetworkState;
  notification: INotificationState;
}

export const store = configureStore({
  reducer: {
    lang: langReducers,
    wallets: walletsReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer,
    accountSync: accountSyncReducer,
    priceInfo: priceInfoReducer,
    priceHistory: priceHistoryReducer,
    network: networkReducer,
    notification: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
