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

import dialogReducer, { IDialogState } from './dialog';
import langReducers, { ILangState } from './lang';
import walletReducer, { IWalletState } from './wallet';

import addAccountReducer, { IAddAccountState } from './addAccountSlice'; // Import the addAccount reducer

export interface RootState {
  wallet: IWalletState;
  lang: ILangState;
  dialog: IDialogState;
  addAccount: IAddAccountState; // Add a new slice for addAccount
}

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    lang: langReducers,
    dialog: dialogReducer,
    addAccount: addAccountReducer, // add the addAccount reducer here
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
