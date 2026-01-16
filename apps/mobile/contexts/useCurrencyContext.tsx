import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSupportedCurrencies,
  loadCurrency,
  selectCurrency,
  setCurrency,
} from '@/store/currency';
import { IFiatCurrency } from '@cypherock/coins';

export interface CurrencyContextInterface {
  currentCurrency: string;
  availableCurrencies: IFiatCurrency[];
  isLoading: boolean;
  updateCurrency: (currency: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextInterface>(
  {} as CurrencyContextInterface,
);

export const CurrencyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentCurrency, availableCurrencies, isLoading } =
    useAppSelector(selectCurrency);

  const updateCurrency = useCallback(
    (currency: string) => {
      dispatch(setCurrency(currency) as any);
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(loadCurrency() as any);
    dispatch(fetchSupportedCurrencies() as any);
  }, [dispatch]);

  const ctx = useMemo(
    () => ({
      currentCurrency,
      availableCurrencies,
      isLoading,
      updateCurrency,
    }),
    [currentCurrency, availableCurrencies, isLoading, updateCurrency],
  );

  return (
    <CurrencyContext.Provider value={ctx}>{children}</CurrencyContext.Provider>
  );
};

export const useCurrency = () => React.useContext(CurrencyContext);
