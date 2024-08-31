import { IInheritancePlan } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IInheritancePlanState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IInheritancePlanState = {
  isLoaded: false,
  inheritancePlans: [],
} as IInheritancePlanState;

export const inheritancePlanSlice = createSlice({
  name: 'inheritancePlans',
  initialState,
  reducers: {
    setInheritancePlans: (
      state,
      payload: PayloadAction<IInheritancePlan[]>,
    ) => {
      state.inheritancePlans = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setInheritancePlans } = inheritancePlanSlice.actions;

export const selectInheritancePlans = (state: RootState) =>
  state.inheritancePlan;

export default inheritancePlanSlice.reducer;
