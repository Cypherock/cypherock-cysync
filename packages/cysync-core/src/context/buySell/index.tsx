import {
  IPaymentMethod,
  IPreorderResult,
  ISupportedCryptoCurrency,
  ISupportedFiatCurrency,
  ITradingPairs,
} from '@cypherock/app-support-buy-sell';
import { getAsset } from '@cypherock/coin-support-utils';
import { IEvmErc20Token } from '@cypherock/coins';
import { DropDownItemProps, Typography } from '@cypherock/cysync-ui';
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
  useStateWithRef,
  useWalletDropdown,
} from '~/hooks';
import {
  useAppSelector,
  selectUnHiddenAccounts,
  selectLanguage,
} from '~/store';
import { buySellSupport } from '~/utils/buysell';

export enum BuySellState {
  CURRENCY_SELECT = 0,
  ACCOUNT_SELECT = 1,
  ORDER = 2,
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
  selectedFiatCurrency?: ISupportedFiatCurrency;
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
  isLoadingPaymentMethodList: boolean;
  paymentMethodDropdownList: DropDownItemProps[];
  selectedPaymentMethod: IPaymentMethod | undefined;
  handlePaymentMethodChange: (id?: string) => void;
  preorderDetails?: IPreorderResult;
  isPreordering: boolean;
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
  const lang = useAppSelector(selectLanguage);

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

  const [
    selectedFiatCurrency,
    setSelectedFiatCurrency,
    selectedFiatCurrencyRef,
  ] = useStateWithRef<ISupportedFiatCurrency | undefined>(undefined);
  const [
    selectedCryptoCurrency,
    setSelectedCryptoCurrency,
    selectedCryptoCurrencyRef,
  ] = useStateWithRef<
    { coin: ISupportedCryptoCurrency; id: string } | undefined
  >(undefined);
  const [fiatDropdownList, setFiatDropdownList] = useState<DropDownItemProps[]>(
    [],
  );
  const [cryptoDropdownList, setCryptoDropdownList] = useState<
    DropDownItemProps[]
  >([]);

  const [fiatAmount, setFiatAmount, fiatAmountRef] =
    useStateWithRef<string>('');
  const [cryptoAmount, setCryptoAmount, cryptoAmountRef] =
    useStateWithRef<string>('');
  const [amountError] = useState<string | undefined>();
  const [isAmountDiabled, setIsAmountDisabled] = useState<boolean>(true);

  const paymentMethodsRef = useRef<IPaymentMethod[]>([]);
  const [paymentMethodDropdownList, setPaymentMethodDropdownList] = useState<
    DropDownItemProps[]
  >([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    IPaymentMethod | undefined
  >();
  const [preorderDetails, setPreorderDetails] = useState<
    IPreorderResult | undefined
  >();

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
      shortForm: `(${f.currency.code.toUpperCase()})`,
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
        shortForm: `(${c.coin.abbr})`,
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
        tradingPairs.current.fiatCurrencies.find(f => f.code === currency),
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

  const [init, isInitializing, isInitialized, resetInitialization] = useAsync(
    initHandler,
    onError,
  );

  const handleAmountEstimation = useCallback(
    async (params: { fiatAmount?: string; cryptoAmount?: string }) => {
      if (
        !selectedFiatCurrencyRef.current ||
        !selectedCryptoCurrencyRef.current
      )
        return false;
      if (!params.fiatAmount && !params.cryptoAmount) return false;

      // TODO: Handle cases where the input amount is invalid
      const result = await buySellSupport.getEstimatedQuote({
        cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
        fiatCurrency: selectedFiatCurrencyRef.current,
        cryptoAmount: params.cryptoAmount,
        fiatAmount: params.fiatAmount,
      });

      if (result.totalAmount) {
        if (params.fiatAmount) {
          setCryptoAmount(result.totalAmount);
          setFiatAmount(params.fiatAmount);
        } else if (params.cryptoAmount) {
          setFiatAmount(result.totalAmount);
          setCryptoAmount(params.cryptoAmount);
        }
      }
      return true;
    },
    [],
  );

  const [estimateAmount, , , resetEstimation] = useAsync(
    handleAmountEstimation,
    onError,
  );

  const onFiatAmountChange = useCallback(async (value: string) => {
    await estimateAmount({ fiatAmount: value });
  }, []);

  const onCryptoAmountChange = useCallback(async (value: string) => {
    await estimateAmount({ cryptoAmount: value });
  }, []);

  useEffect(() => {
    if (selectedCryptoCurrency && selectedFiatCurrency) {
      setIsAmountDisabled(false);
    } else {
      setIsAmountDisabled(true);
    }
  }, [selectedCryptoCurrency, selectedFiatCurrency]);

  const getPaymentMethodListHandler = useCallback(async () => {
    if (!selectedFiatCurrencyRef.current || !selectedCryptoCurrencyRef.current)
      return false;

    const result = await buySellSupport.getPaymentMethods({
      cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
      fiatCurrency: selectedFiatCurrencyRef.current,
      cryptoAmount: cryptoAmountRef.current,
      fiatAmount: fiatAmountRef.current,
      language: lang.lang.split('-')[0],
    });

    paymentMethodsRef.current = result;

    const dropdownList: DropDownItemProps[] = result.map(r => ({
      id: `${r.payMethodCode}-${r.payMethodSubCode ?? ''}`,
      checkType: 'radio',
      text: r.paymentMethod,
    }));
    setPaymentMethodDropdownList(dropdownList);

    return true;
  }, [lang]);

  const [
    getPaymentMethodList,
    isLoadingPaymentMethodList,
    ,
    resetGetPaymentMethodList,
  ] = useAsync(getPaymentMethodListHandler, onError);

  const handlePaymentMethodChange = useCallback((value?: string) => {
    if (!paymentMethodsRef.current) return;
    if (!value) {
      setSelectedPaymentMethod(undefined);
      return;
    }

    const [code, subCode] = value.split('-');
    const method = paymentMethodsRef.current.find(
      p => p.payMethodCode === code && p.payMethodSubCode === subCode,
    );
    setSelectedPaymentMethod(method);
  }, []);

  const preorderHandler = useCallback(async () => {
    if (
      !selectedFiatCurrencyRef.current ||
      !selectedCryptoCurrencyRef.current ||
      !selectedPaymentMethod ||
      !fiatAmountRef.current ||
      !selectedAccount
    )
      return false;

    const result = await buySellSupport.preorder({
      cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
      fiatCurrency: selectedFiatCurrencyRef.current,
      fiatAmount: fiatAmountRef.current,
      payMethodCode: selectedPaymentMethod.payMethodCode ?? '',
      payMethodSubCode: selectedPaymentMethod.payMethodSubCode ?? '',
      address: selectedAccount.xpubOrAddress,
    });

    setPreorderDetails(result);

    return true;
  }, [selectedAccount, selectedPaymentMethod]);

  const [preorder, isPreordering, , resetPreorder] = useAsync(
    preorderHandler,
    onError,
  );

  const onNextState = useCallback(() => {
    if (state === BuySellState.CURRENCY_SELECT) {
      if (!selectedFiatCurrency || !selectedCryptoCurrency) {
        return;
      }
      getPaymentMethodList();
      setState(BuySellState.ACCOUNT_SELECT);
    } else if (state === BuySellState.ACCOUNT_SELECT) {
      if (!selectedAccount || !selectedPaymentMethod) {
        return;
      }
      preorder();
      setState(BuySellState.ORDER);
    }
  }, [
    state,
    selectedWallet,
    selectedAccount,
    selectedFiatCurrency,
    selectedCryptoCurrency,
    selectedPaymentMethod,
    getPaymentMethodList,
    preorder,
  ]);

  const reset = useCallback(async () => {
    setUnhandledError(undefined);
    setSelectedWallet(undefined);
    setSelectedAccount(undefined);
    setFiatDropdownList([]);
    setCryptoDropdownList([]);
    setSelectedFiatCurrency(undefined);
    setSelectedCryptoCurrency(undefined);
    tradingPairs.current = undefined;
    setFiatAmount('');
    setCryptoAmount('');
    setPreorderDetails(undefined);
    setState(BuySellState.CURRENCY_SELECT);
    setSelectedPaymentMethod(undefined);
    setPaymentMethodDropdownList([]);
    paymentMethodsRef.current = [];
    resetInitialization();
    resetEstimation();
    resetGetPaymentMethodList();
    resetPreorder();
  }, [
    resetEstimation,
    resetInitialization,
    resetGetPaymentMethodList,
    resetPreorder,
  ]);

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
    isLoadingPaymentMethodList,
    paymentMethodDropdownList,
    selectedPaymentMethod,
    handlePaymentMethodChange,
    isPreordering,
    preorderDetails,
  });

  return (
    <BuySellContext.Provider value={ctx}>{children}</BuySellContext.Provider>
  );
};

export function useBuySell(): BuySellContextInterface {
  return useContext(BuySellContext);
}
