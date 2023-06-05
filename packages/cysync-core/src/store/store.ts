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
import walletReducer, { IWalletState } from './wallet';
import langReducers, { ILangState } from './lang';

export type RootState = {
  wallet: IWalletState;
  lang: ILangState;
};

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    lang: langReducers,
  },
});

export const StoreProvider = Provider;

export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch<AnyAction>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
