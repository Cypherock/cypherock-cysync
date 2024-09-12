import {
  ISupportedCryptoCurrency,
  ITradingPairs,
} from '@cypherock/app-support-buy-sell';
import { getAsset } from '@cypherock/coin-support-utils';
import { IEvmErc20Token, IFiatCurrency } from '@cypherock/coins';
import { DropDownItemProps, Typography } from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { CoinIcon } from '~/components';
import {
  useAccountDropdown,
  useAsync,
  useMemoReturn,
  useWalletDropdown,
} from '~/hooks';
import { useAppSelector, selectUnHiddenAccounts } from '~/store';
import { buySellSupport } from '~/utils/buysell';

export enum BuySellState {
  CURRENCY_SELECT = 0,
  ACCOUNT_SELECT = 1,
}

export interface BuySellContextInterface {
  init: () => Promise<boolean>;
  reset: () => Promise<void>;
  isInitializing: boolean;
  isInitialized: boolean;
  unhandledError?: any;
  tradingPairs?: ITradingPairs;
  selectedWallet: IWallet | undefined;
  handleWalletChange: (id?: string) => void;
  walletDropdownList: DropDownItemProps[];
  selectedAccount?: IAccount;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  accountDropdownList: DropDownItemProps[];
  accountList: Record<string, IAccount>;
  state: BuySellState;
  fiatDropdownList: DropDownItemProps[];
  selectedFiatCurrency?: IFiatCurrency;
  cryptoDropdownList: DropDownItemProps[];
  selectedCryptoCurrency?: { coin: ISupportedCryptoCurrency; id: string };
  handleFiatCurrencyChange: (id?: string) => void;
  handleCryptoCurrencyChange: (id?: string) => void;
  onNextState: () => void;
  fiatAmount: string;
  cryptoAmount: string;
  isAmountDiabled: boolean;
  amountError?: string;
  onFiatAmountChange: (value: string) => Promise<void>;
  onCryptoAmountChange: (value: string) => Promise<void>;
}

export interface BuySellProps {
  children: ReactNode;
}

export const BuySellContext: Context<BuySellContextInterface> =
  createContext<BuySellContextInterface>({} as BuySellContextInterface);

export interface BuySellContextProviderProps extends BuySellProps {
  children: ReactNode;
}

export const BuySellProvider: FC<BuySellContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState(BuySellState.CURRENCY_SELECT);
  const tradingPairs = useRef<ITradingPairs | undefined>();

  const [unhandledError, setUnhandledError] = React.useState<any>();

  const {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    setSelectedWallet,
  } = useWalletDropdown();
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();

  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState<
    IFiatCurrency | undefined
  >();
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState<
    { coin: ISupportedCryptoCurrency; id: string } | undefined
  >();
  const [fiatDropdownList, setFiatDropdownList] = useState<DropDownItemProps[]>(
    [],
  );
  const [cryptoDropdownList, setCryptoDropdownList] = useState<
    DropDownItemProps[]
  >([]);

  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [amountError] = useState<string | undefined>();
  const [isAmountDiabled, setIsAmountDisabled] = useState<boolean>(true);

  const { accounts } = useAppSelector(selectUnHiddenAccounts);

  useEffect(() => {
    setSelectedAccount(undefined);
  }, [selectedWallet]);

  const accountList: Record<string, IAccount> = useMemo(
    () => Object.fromEntries(accounts.map(a => [a.__id, a])),
    [accounts],
  );

  const { accountDropdownList: accountDropdownListSrc } = useAccountDropdown({
    selectedWallet,
  });

  const accountDropdownList = useMemo(
    () =>
      accountDropdownListSrc
        .filter(
          a =>
            Boolean(a.id && accountList[a.id]) &&
            selectedCryptoCurrency &&
            selectedCryptoCurrency.coin.coin.id ===
              accountList[a.id ?? ''].assetId,
        )
        .map(a => {
          const account = a.id ? accountList[a.id] : undefined;
          const shortForm = account
            ? getAsset(account.parentAssetId, account.assetId).abbr
            : undefined;

          return {
            ...a,
            shortForm,
            rightText: undefined,
            showRightTextOnBottom: undefined,
          };
        }),
    [accountDropdownListSrc, accountList, selectedCryptoCurrency],
  );

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const initHandler = useCallback(async () => {
    const pairs = await buySellSupport.getTradingPairs();
    tradingPairs.current = pairs;

    const fiatDropdown: DropDownItemProps[] = pairs.fiatCurrencies.map(f => ({
      id: f.code,
      checkType: 'radio',
      leftImage: (
        <Typography $fontSize={24}>{f.currency.countryFlag}</Typography>
      ),
      text: f.currency.name,
      rightText: f.currency.code.toUpperCase(),
    }));
    setFiatDropdownList(fiatDropdown);

    const cryptoDropdown: DropDownItemProps[] = pairs.cryptoCurrencies.map(
      c => ({
        id: c.coin.id,
        checkType: 'radio',
        leftImage: (
          <CoinIcon
            assetId={c.coin.id}
            parentAssetId={(c.coin as IEvmErc20Token).parentId ?? c.coin.id}
          />
        ),
        text: c.coin.name,
        rightText: c.coin.abbr,
      }),
    );

    setCryptoDropdownList(cryptoDropdown);
    return true;
  }, []);

  const handleFiatCurrencyChange = useCallback(
    (currency?: string) => {
      if (!tradingPairs.current) return;
      if (!currency) setSelectedFiatCurrency(undefined);

      setSelectedFiatCurrency(
        tradingPairs.current.fiatCurrencies.find(f => f.code === currency)
          ?.currency,
      );
    },
    [selectedCryptoCurrency],
  );

  const handleCryptoCurrencyChange = useCallback((currency?: string) => {
    if (!tradingPairs.current) return;
    if (!currency) {
      setSelectedCryptoCurrency(undefined);
      return;
    }

    const coin = tradingPairs.current.cryptoCurrencies.find(
      c => c.coin.id === currency,
    );

    if (!coin) setSelectedCryptoCurrency(undefined);
    else setSelectedCryptoCurrency({ coin, id: currency });
  }, []);

  const onNextState = useCallback(() => {
    if (state === BuySellState.CURRENCY_SELECT) {
      if (!selectedFiatCurrency || !selectedCryptoCurrency) {
        return;
      }
      setState(BuySellState.ACCOUNT_SELECT);
    }
  }, [
    state,
    selectedWallet,
    selectedAccount,
    selectedFiatCurrency,
    selectedCryptoCurrency,
  ]);

  const [init, isInitializing, isInitialized, resetInitialization] = useAsync(
    initHandler,
    onError,
  );

  const onFiatAmountChange = useCallback(async (value: string) => {
    await sleep(500);
    setFiatAmount(value);
  }, []);

  const onCryptoAmountChange = useCallback(async (value: string) => {
    await sleep(500);
    setCryptoAmount(value);
  }, []);

  useEffect(() => {
    if (selectedCryptoCurrency && selectedFiatCurrency) {
      setIsAmountDisabled(false);
    } else {
      setIsAmountDisabled(true);
    }
  }, [selectedCryptoCurrency, selectedFiatCurrency]);

  const reset = useCallback(async () => {
    setUnhandledError(undefined);
    setSelectedWallet(undefined);
    setSelectedAccount(undefined);
    setFiatDropdownList([]);
    setCryptoDropdownList([]);
    setSelectedFiatCurrency(undefined);
    setSelectedCryptoCurrency(undefined);
    tradingPairs.current = undefined;
    resetInitialization();
  }, []);

  const ctx = useMemoReturn<BuySellContextInterface>({
    init,
    reset,
    isInitializing,
    isInitialized,
    unhandledError,
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedAccount,
    accountDropdownList,
    setSelectedAccount,
    accountList,
    state,
    fiatDropdownList,
    selectedFiatCurrency,
    cryptoDropdownList,
    selectedCryptoCurrency,
    handleFiatCurrencyChange,
    handleCryptoCurrencyChange,
    onNextState,
    fiatAmount,
    cryptoAmount,
    isAmountDiabled,
    amountError,
    onFiatAmountChange,
    onCryptoAmountChange,
  });

  return (
    <BuySellContext.Provider value={ctx}>{children}</BuySellContext.Provider>
  );
};

export function useBuySell(): BuySellContextInterface {
  return useContext(BuySellContext);
}
