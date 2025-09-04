import { DEFAULT_CURRENCY } from '@cypherock/coin-support-utils';
import { fiatCurrencyList, IFiatCurrency } from '@cypherock/coins';
import axios from 'axios';
import React, {
  PropsWithChildren,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { openFullPageLoaderDialog } from '~/actions';
import { config } from '~/config';
import { useMemoReturn } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';
import { keyValueStore } from '~/utils';
import logger from '~/utils/logger';

export interface CurrencyContextInterface {
  currentCurrency: string;
  availableCurrencies: IFiatCurrency[];
  updateCurrency: (c: string) => void;
}

export const CurrencyContext: React.Context<CurrencyContextInterface> =
  React.createContext<CurrencyContextInterface>({} as CurrencyContextInterface);

export const CurrencyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [availableCurrencies, setAvailableCurrencies] = useState(
    Object.values(fiatCurrencyList).filter(c =>
      [DEFAULT_CURRENCY].includes(c.code.toLowerCase()),
    ),
  );
  const dispatch = useAppDispatch();

  const fetchVsCurrency = useCallback(async () => {
    try {
      logger.info('fetching vsCurrencies');
      const res = await axios.get(
        `${config.API_CYPHEROCK}/price/get-supported-vs-currencies`,
      );
      if (res.status === 200) {
        const { data } = res.data;
        const currencies = Object.values(fiatCurrencyList).filter(c =>
          data.includes(c.code.toLowerCase()),
        );
        setAvailableCurrencies(currencies);
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      logger.error('could not fetch vsCurrencies', { error });
    }
  }, [fiatCurrencyList]);

  const loadCurrency = async () => {
    const currency = await keyValueStore.appCurrency.get();
    logger.info('loading currency', { currency });
    if (currency) {
      setCurrentCurrency(currency);
    }
  };

  const updateCurrency = useCallback((currency: string) => {
    dispatch(openFullPageLoaderDialog({}));
    setTimeout(() => {
      dispatch(closeDialog('fullPageLoaderDialog'));
    }, 5000);
    const normalized = currency.toLowerCase();
    logger.info('update currency', { currency });
    startTransition(() => {
      setCurrentCurrency(prev => {
        if (prev === normalized) return prev;
        keyValueStore.appCurrency.set(normalized);
        return normalized;
      });
    });
  }, []);

  useEffect(() => {
    fetchVsCurrency();
  }, []);

  useEffect(() => {
    loadCurrency();
  }, []);

  const ctx = useMemoReturn({
    currentCurrency,
    availableCurrencies,
    updateCurrency,
  });

  return (
    <CurrencyContext.Provider value={ctx}>{children}</CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextInterface {
  return React.useContext(CurrencyContext);
}
