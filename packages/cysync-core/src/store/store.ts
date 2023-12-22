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

import accountReducer, { IAccountState } from './account';
import accountSyncReducer, { IAccountSyncState } from './accountSync';
import deviceReducer, { IDeviceState } from './device';
import dialogReducer, { IDialogState } from './dialog';
import discreetModeReducer, { IDiscreetModeState } from './discreetMode';
import langReducers, { ILangState } from './lang';
import networkReducer, { INetworkState } from './network';
import notificationReducer, { INotificationState } from './notification';
import priceHistoryReducer, { IPriceHistoryState } from './priceHistroy';
import priceInfoReducer, { IPriceInfoState } from './priceInfo';
import snackBarReducer, { ISnackBarState } from './snackBar';
import transactionReducer, { ITransactionState } from './transaction';
import walletReducer, { IWalletState } from './wallet';

export interface RootState {
  wallet: IWalletState;
  lang: ILangState;
  dialog: IDialogState;
  account: IAccountState;
  device: IDeviceState;
  priceInfo: IPriceInfoState;
  priceHistory: IPriceHistoryState;
  transaction: ITransactionState;
  discreetMode: IDiscreetModeState;
  accountSync: IAccountSyncState;
  snackBar: ISnackBarState;
  notification: INotificationState;
  network: INetworkState;
}

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    lang: langReducers,
    dialog: dialogReducer,
    account: accountReducer,
    device: deviceReducer,
    priceInfo: priceInfoReducer,
    priceHistory: priceHistoryReducer,
    transaction: transactionReducer,
    discreetMode: discreetModeReducer,
    accountSync: accountSyncReducer,
    snackBar: snackBarReducer,
    notification: notificationReducer,
    network: networkReducer,
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
