import { DEFAULT_CURRENCY } from '@cypherock/coin-support-utils';
import { fiatCurrencyList, IFiatCurrency } from '@cypherock/coins';
import React, {
  PropsWithChildren,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { openFullPageLoaderDialog } from '~/actions';
import { useMemoReturn } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';
import { keyValueStore } from '~/utils';
import logger from '~/utils/logger';

export interface CurrencyContextInterface {
  currentCurrency: string;
  availableCurrencies: IFiatCurrency[];
  updateCurrency: (c: string) => void;
}

const SupportedVsCurrencies = [
  'btc',
  'eth',
  'ltc',
  'bch',
  'bnb',
  'eos',
  'xrp',
  'xlm',
  'link',
  'dot',
  'yfi',
  'sol',
  'usd',
  'aed',
  'ars',
  'aud',
  'bdt',
  'bhd',
  'bmd',
  'brl',
  'cad',
  'chf',
  'clp',
  'cny',
  'czk',
  'dkk',
  'eur',
  'gbp',
  'gel',
  'hkd',
  'huf',
  'idr',
  'ils',
  'inr',
  'jpy',
  'krw',
  'kwd',
  'lkr',
  'mmk',
  'mxn',
  'myr',
  'ngn',
  'nok',
  'nzd',
  'php',
  'pkr',
  'pln',
  'rub',
  'sar',
  'sek',
  'sgd',
  'thb',
  'try',
  'twd',
  'uah',
  'vef',
  'vnd',
  'zar',
  'xdr',
  'xag',
  'xau',
  'bits',
  'sats',
];

export const CurrencyContext: React.Context<CurrencyContextInterface> =
  React.createContext<CurrencyContextInterface>({} as CurrencyContextInterface);

export const CurrencyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [availableCurrencies] = useState(
    Object.values(fiatCurrencyList).filter(c =>
      SupportedVsCurrencies.includes(c.code.toLowerCase()),
    ),
  );
  const dispatch = useAppDispatch();

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
