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

import accountsReducer, { AccountsState } from './accounts';
import langReducers, { ILangState } from './lang';
import walletsReducer, { WalletsState } from './wallets';

export interface RootState {
  lang: ILangState;
  wallets: WalletsState;
  accounts: AccountsState;
}

export const store = configureStore({
  reducer: {
    lang: langReducers,
    wallets: walletsReducer,
    accounts: accountsReducer,
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
