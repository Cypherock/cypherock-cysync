import {
  IPaymentMethod,
  IPreorderResult,
  ISupportedCryptoCurrency,
  ISupportedFiatCurrency,
  ITradingPairs,
} from '@cypherock/app-support-buy-sell';
import { getCoinSupport } from '@cypherock/coin-support';
import { getAsset } from '@cypherock/coin-support-utils';
import { IEvmErc20Token } from '@cypherock/coins';
import {
  DropDownItemProps,
  parseLangTemplate,
  Typography,
} from '@cypherock/cysync-ui';
import {
  BigNumber,
  createLoggerWithPrefix,
  NumberLike,
} from '@cypherock/cysync-utils';
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

import baseLogger from '../../utils/logger';

const logger = createLoggerWithPrefix(baseLogger, 'BuySell');

export enum BuySellState {
  CURRENCY_SELECT = 0,
  ACCOUNT_SELECT = 1,
  ORDER = 2,
}

export interface BuySellContextInterface {
  init: () => Promise<boolean>;
  reset: () => Promise<void>;
  onRetry: (isForced?: boolean) => void;
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
  onPreviousState: () => void;
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
  const [cryptoAmount, setCryptoAmount] = useStateWithRef<string>('');
  const [amountError, setAmountError] = useState<string | undefined>();
  const [isAmountDiabled, setIsAmountDisabled] = useState<boolean>(true);

  const paymentMethodsRef = useRef<IPaymentMethod[] | undefined>();
  const [paymentMethodDropdownList, setPaymentMethodDropdownList] = useState<
    DropDownItemProps[]
  >([]);
  const minFiatAmountRef = useRef<BigNumber>(new BigNumber(0));
  const maxFiatAmountRef = useRef<BigNumber>(new BigNumber(0));
  const minCryptoAmountRef = useRef<BigNumber>(new BigNumber(0));
  const maxCryptoAmountRef = useRef<BigNumber>(new BigNumber(0));
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
            a.id &&
            accountList[a.id] &&
            selectedCryptoCurrency &&
            (selectedCryptoCurrency.coin.coin.id ===
              accountList[a.id].assetId ||
              (selectedCryptoCurrency.coin.coin as any).parentId ===
                accountList[a.id].assetId),
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

  const onRetry = useCallback(
    (isForced?: boolean) => {
      if (state !== BuySellState.ORDER || isForced) {
        setState(BuySellState.CURRENCY_SELECT);
        resetUserInput();
      }
      resetPreorder();
    },
    [state],
  );

  const initHandler = useCallback(async () => {
    try {
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
        c => {
          const { parentId } = c.coin as IEvmErc20Token;
          return {
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
            rightText: parentId
              ? parentId[0].toUpperCase() + parentId.slice(1).toLowerCase()
              : '',
          };
        },
      );

      setCryptoDropdownList(cryptoDropdown);
      return true;
    } catch (err) {
      onError(err);
      return false;
    }
  }, []);

  const handleFiatCurrencyChange = useCallback(
    (currency?: string) => {
      if (!tradingPairs.current) return;
      if (!currency) setSelectedFiatCurrency(undefined);

      setSelectedFiatCurrency(
        tradingPairs.current.fiatCurrencies.find(f => f.code === currency),
      );

      if (currency) {
        const cryptoDropdown: DropDownItemProps[] =
          tradingPairs.current.cryptoCurrencies
            .filter(
              c =>
                tradingPairs.current?.mapping[currency][
                  c.coin.abbr.toUpperCase()
                ],
            )
            .map(c => {
              const { parentId } = c.coin as IEvmErc20Token;
              return {
                id: c.coin.id,
                checkType: 'radio',
                leftImage: (
                  <CoinIcon
                    assetId={c.coin.id}
                    parentAssetId={
                      (c.coin as IEvmErc20Token).parentId ?? c.coin.id
                    }
                  />
                ),
                text: c.coin.name,
                shortForm: `(${c.coin.abbr})`,
                rightText: parentId
                  ? parentId[0].toUpperCase() + parentId.slice(1).toLowerCase()
                  : '',
              };
            });
        setCryptoDropdownList(cryptoDropdown);
      }
      paymentMethodsRef.current = undefined;
    },
    [selectedCryptoCurrency],
  );

  const handleCryptoCurrencyChange = useCallback(
    (currency?: string) => {
      if (!tradingPairs.current) return;
      if (!currency) {
        setSelectedCryptoCurrency(undefined);
        return;
      }

      const coin = tradingPairs.current.cryptoCurrencies.find(
        c => c.coin.id === currency,
      );

      paymentMethodsRef.current = undefined;
      if (!coin) setSelectedCryptoCurrency(undefined);
      else setSelectedCryptoCurrency({ coin, id: currency });
    },
    [tradingPairs],
  );

  const [init, isInitializing, isInitialized, resetInitialization] = useAsync(
    initHandler,
    onError,
  );

  const updateFiatAmountLimit = () => {
    if (!paymentMethodsRef.current) return;
    minFiatAmountRef.current = new BigNumber(Infinity);
    maxFiatAmountRef.current = new BigNumber(0);

    minCryptoAmountRef.current = new BigNumber(Infinity);
    maxCryptoAmountRef.current = new BigNumber(0);

    for (const paymentMethod of paymentMethodsRef.current) {
      minFiatAmountRef.current = BigNumber.min(
        minFiatAmountRef.current,
        new BigNumber(paymentMethod.fiatMinLimit ?? '0'),
      );
      maxFiatAmountRef.current = BigNumber.max(
        maxFiatAmountRef.current,
        new BigNumber(paymentMethod.fiatMaxLimit ?? '0'),
      );

      minCryptoAmountRef.current = BigNumber.min(
        minCryptoAmountRef.current,
        new BigNumber(paymentMethod.cryptoMinLimit ?? '0'),
      );
      maxCryptoAmountRef.current = BigNumber.max(
        maxCryptoAmountRef.current,
        new BigNumber(paymentMethod.cryptoMaxLimit ?? '0'),
      );
    }
  };

  const isValueInRange = (
    min: BigNumber,
    value: NumberLike,
    max: BigNumber,
  ) => {
    const valueNum = new BigNumber(value);
    return (
      valueNum.isGreaterThanOrEqualTo(min) && valueNum.isLessThanOrEqualTo(max)
    );
  };

  useEffect(() => {
    setAmountError('');
  }, [selectedCryptoCurrency, selectedFiatCurrency]);

  const handleAmountEstimation = async (params: {
    fiatAmount?: string;
    cryptoAmount?: string;
  }) => {
    if (!selectedFiatCurrencyRef.current || !selectedCryptoCurrencyRef.current)
      return false;
    if (!params.fiatAmount && !params.cryptoAmount) return false;

    try {
      if (paymentMethodsRef.current === undefined) {
        // This api returs all payment methods regardless of amount
        // Hence the hardcoded amount values
        // @todo: upate this when binance has fixed their api
        const result = await buySellSupport.getPaymentMethods({
          cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
          fiatCurrency: selectedFiatCurrencyRef.current,
          cryptoAmount: '1',
          fiatAmount: '1',
        });
        paymentMethodsRef.current = result;
        updateFiatAmountLimit();
      }
      if (paymentMethodsRef.current.length === 0) {
        setAmountError(
          lang.strings.onramp.buy.selectCurrency.amount.noMethodsError,
        );
        return false;
      }
      if (
        params.fiatAmount &&
        !isValueInRange(
          minFiatAmountRef.current,
          params.fiatAmount,
          maxFiatAmountRef.current,
        )
      ) {
        setAmountError(
          parseLangTemplate(
            lang.strings.onramp.buy.selectCurrency.amount.limitError,
            {
              min: minFiatAmountRef.current.toString(),
              max: maxFiatAmountRef.current.toString(),
            },
          ),
        );
        return false;
      }

      if (
        params.cryptoAmount &&
        !isValueInRange(
          minCryptoAmountRef.current,
          params.cryptoAmount,
          maxCryptoAmountRef.current,
        )
      ) {
        setAmountError(
          parseLangTemplate(
            lang.strings.onramp.buy.selectCurrency.amount.limitError,
            {
              min: minCryptoAmountRef.current.toString(),
              max: maxCryptoAmountRef.current.toString(),
            },
          ),
        );
        return false;
      }

      const result = await buySellSupport.getEstimatedQuote({
        cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
        fiatCurrency: selectedFiatCurrencyRef.current,
        cryptoAmount: params.cryptoAmount,
        fiatAmount: params.fiatAmount,
      });

      if (result.totalAmount) {
        if (result.totalAmount === '0') {
          setAmountError(lang.strings.onramp.buy.selectCurrency.amount.error);
          return false;
        }
        setAmountError(undefined);
        if (params.fiatAmount) {
          setCryptoAmount(result.totalAmount);
        } else if (params.cryptoAmount) {
          setFiatAmount(result.totalAmount);
        }
      }
      return true;
    } catch (err: any) {
      onError(err);
      return false;
    }
  };

  const [estimateAmount, , , resetEstimation] = useAsync(
    handleAmountEstimation,
    onError,
  );

  const onFiatAmountChange = async (value: string) => {
    setFiatAmount(value);
    await estimateAmount({ fiatAmount: value });
  };

  const onCryptoAmountChange = async (value: string) => {
    setCryptoAmount(value);
    await estimateAmount({ cryptoAmount: value });
  };

  useEffect(() => {
    if (selectedCryptoCurrency && selectedFiatCurrency) {
      setIsAmountDisabled(false);
    } else {
      setIsAmountDisabled(true);
    }
  }, [selectedCryptoCurrency, selectedFiatCurrency]);

  useEffect(() => {
    setFiatAmount('');
    setCryptoAmount('');
  }, [selectedCryptoCurrency, selectedFiatCurrency]);

  const getPaymentMethodListHandler = useCallback(async () => {
    if (!selectedFiatCurrencyRef.current || !selectedCryptoCurrencyRef.current)
      return false;
    if (!paymentMethodsRef.current) {
      logger.error('Payments methods ref should be defined at this point');
      return false;
    }

    try {
      const dropdownList: DropDownItemProps[] = paymentMethodsRef.current
        .filter(p => {
          const fiatAmountNum = new BigNumber(fiatAmountRef.current);
          return (
            fiatAmountNum.isGreaterThanOrEqualTo(p.fiatMinLimit ?? 0) &&
            fiatAmountNum.isLessThanOrEqualTo(p.fiatMaxLimit ?? 0)
          );
        })
        .map(r => ({
          id: `${r.payMethodCode}-${r.payMethodSubCode ?? ''}`,
          checkType: 'radio',
          text: r.paymentMethod,
        }));
      setPaymentMethodDropdownList(dropdownList);

      return true;
    } catch (err: any) {
      onError(err);
      return false;
    }
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

    try {
      const coinSupport = getCoinSupport(selectedAccount.familyId);
      const result = await buySellSupport.preorder({
        cryptoCurrency: selectedCryptoCurrencyRef.current.coin,
        fiatCurrency: selectedFiatCurrencyRef.current,
        fiatAmount: fiatAmountRef.current,
        payMethodCode: selectedPaymentMethod.payMethodCode ?? '',
        payMethodSubCode: selectedPaymentMethod.payMethodSubCode ?? '',
        address: await coinSupport.getAccountAddress({
          account: selectedAccount,
        }),
      });
      setPreorderDetails(result);
      return true;
    } catch (err) {
      onError(err);
      return false;
    }
  }, [
    selectedAccount,
    selectedPaymentMethod,
    selectedFiatCurrencyRef,
    selectedCryptoCurrencyRef,
    buySellSupport,
    fiatAmountRef,
  ]);

  const [preorder, isPreordering, , resetPreorder] = useAsync(
    preorderHandler,
    onError,
  );

  const onPreviousState = useCallback(() => {
    if (state === BuySellState.ORDER) {
      getPaymentMethodList();
      setState(BuySellState.ACCOUNT_SELECT);
    } else if (state === BuySellState.ACCOUNT_SELECT) {
      setState(BuySellState.CURRENCY_SELECT);
    }
  }, [state, getPaymentMethodList]);

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

  const resetUserInput = useCallback(() => {
    setUnhandledError(undefined);
    setSelectedWallet(undefined);
    setSelectedAccount(undefined);
    setSelectedFiatCurrency(undefined);
    setSelectedCryptoCurrency(undefined);
    setFiatAmount('');
    setCryptoAmount('');
    setPreorderDetails(undefined);
    setSelectedPaymentMethod(undefined);

    resetEstimation();
    resetGetPaymentMethodList();
    resetPreorder();
  }, [resetEstimation, resetGetPaymentMethodList, resetPreorder]);

  const ctx = useMemoReturn<BuySellContextInterface>({
    init,
    reset,
    onRetry,
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
    onPreviousState,
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
