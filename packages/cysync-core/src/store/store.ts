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
import dialogReducer, { IDialogState } from './dialog';
import langReducers, { ILangState } from './lang';
import walletReducer, { IWalletState } from './wallet';

export interface RootState {
  wallet: IWalletState;
  lang: ILangState;
  dialog: IDialogState;
  account: IAccountState;
}

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    lang: langReducers,
    dialog: dialogReducer,
    account: accountReducer,
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
