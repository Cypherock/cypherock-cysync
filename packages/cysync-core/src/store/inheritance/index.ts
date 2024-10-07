// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { IInheritancePlan } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  IInheritancePlanDetails,
  IInheritanceState,
  IWalletAuthTokens,
} from './types';

import type { RootState } from '../store';

export * from './types';

const initialState: IInheritanceState = {
  isLoaded: false,
  walletAuthTokens: {},
  seedAuthTokens: {},
  inheritancePlans: [],
  inheritancePlanDetails: {},
} as IInheritanceState;

export const inheritanceSlice = createSlice({
  name: 'inheritance',
  initialState,
  reducers: {
    updateWalletAuthTokens: (
      state,
      action: PayloadAction<{
        walletId: string;
        authTokens: IWalletAuthTokens;
      }>,
    ) => {
      state.walletAuthTokens[action.payload.walletId] =
        action.payload.authTokens;
      return state;
    },
    updateSeedAuthTokens: (
      state,
      action: PayloadAction<{
        walletId: string;
        authTokens: IWalletAuthTokens;
      }>,
    ) => {
      state.seedAuthTokens[action.payload.walletId] = action.payload.authTokens;
      return state;
    },
    setInheritancePlans: (
      state,
      payload: PayloadAction<IInheritancePlan[]>,
    ) => {
      state.inheritancePlans = payload.payload;
      state.isLoaded = true;
    },
    updateInheritancePlanDetails: (
      state,
      payload: PayloadAction<{
        walletId: string;
        planDetails: IInheritancePlanDetails;
      }>,
    ) => {
      state.inheritancePlanDetails[payload.payload.walletId] =
        payload.payload.planDetails;
      return state;
    },
    clearInheritancePlanDetails: state => {
      state.inheritancePlanDetails = {};
      return state;
    },
  },
});

export const {
  updateWalletAuthTokens,
  updateSeedAuthTokens,
  setInheritancePlans,
  updateInheritancePlanDetails,
  clearInheritancePlanDetails,
} = inheritanceSlice.actions;

export const selectInheritanceWalletAuthTokens = (state: RootState) =>
  state.inheritance.walletAuthTokens;
export const selectInheritanceSeedAuthTokens = (state: RootState) =>
  state.inheritance.seedAuthTokens;

export const selectInheritancePlans = (state: RootState) =>
  state.inheritance.inheritancePlans;

export default inheritanceSlice.reducer;
