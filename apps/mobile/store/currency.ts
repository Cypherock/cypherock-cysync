import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { DEFAULT_CURRENCY } from '@cypherock/coin-support-utils';
import { keyValueStore } from '@/db';
import { fiatCurrencyList, IFiatCurrency } from '@cypherock/coins';
import { config } from '@cypherock/coin-support-utils/src/config';
import logger from '@/utils/logger';

export interface ICurrencyState {
  currentCurrency: string;
  availableCurrencies: IFiatCurrency[];
  isLoading: boolean;
}

const initialState: ICurrencyState = {
  currentCurrency: DEFAULT_CURRENCY,
  availableCurrencies: Object.values(fiatCurrencyList).filter(c =>
    [DEFAULT_CURRENCY].includes(c.code.toLowerCase()),
  ),
  isLoading: false,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrencyState: (state, action: PayloadAction<string>) => {
      state.currentCurrency = action.payload;
    },
    setAvailableCurrencies: (
      state,
      action: PayloadAction<IFiatCurrency[]>,
    ) => {
      state.availableCurrencies = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrencyState, setAvailableCurrencies, setIsLoading } =
  currencySlice.actions;

export const fetchSupportedCurrencies = () => async (dispatch: any) => {
  try {
    dispatch(setIsLoading(true));
    logger.info('Fetching supported currencies');

    const response = await fetch(
      `${config.API_CYPHEROCK}/price/get-supported-vs-currencies`,
    );

    if (response.ok) {
      const { data } = await response.json();
      const currencies = Object.values(fiatCurrencyList).filter(c =>
        data.includes(c.code.toLowerCase()),
      );
      dispatch(setAvailableCurrencies(currencies));
      logger.info('Successfully fetched supported currencies', {
        count: currencies.length,
      });
    } else {
      throw new Error('Invalid server response');
    }
  } catch (error) {
    logger.error('Could not fetch supported currencies', { error });
    // Keep default currencies on error
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const setCurrency = (currency: string) => async (dispatch: any) => {
  const normalized = currency.toLowerCase();
  await keyValueStore.preferredCurrency.set(normalized);
  dispatch(setCurrencyState(normalized));
};

export const loadCurrency = () => async (dispatch: any) => {
  const currency = await keyValueStore.preferredCurrency.get();
  logger.info('Loading currency', { currency });
  if (currency) {
    dispatch(setCurrencyState(currency));
  }
};

export const selectCurrency = (state: RootState) => state.currency;

export default currencySlice.reducer;
