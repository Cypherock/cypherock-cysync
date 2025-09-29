import {
  IOfferDetails,
  BuySellSupport2,
  IGetOffersResponse,
  IProviderDetails,
  ICreateOrderResult,
} from '@cypherock/app-support-buy-sell-2';
import { getAsset } from '@cypherock/coin-support-utils';
import { IFiatCurrency } from '@cypherock/coins';
import { insertBuySellOrder } from '@cypherock/cysync-core-services';
import { DropDownItemProps, Typography } from '@cypherock/cysync-ui';
import {
  IAccount,
  IWallet,
  IBuySellOrder,
  BuySellStatusMap,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react';

import {
  useAccountDropdown,
  useCountryDropdown,
  useCryptoDropdown,
  useFiatDropdown,
  useMemoReturn,
  useWalletDropdown,
} from '~/hooks';
import { useNavigation } from '~/pages/MainApp/BuySell2/hooks';
import { BuySellPage } from '~/pages/MainApp/BuySell2/pages';
import {
  selectLanguage,
  selectUnHiddenAccounts,
  selectWallets,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils/db';

export interface BuySell2ContextInterface {
  reset: () => void;

  // Country functionality
  countryDropdownList: DropDownItemProps[];
  selectedCountry?: { code: string; name: string; flag: string };
  handleCountryChange: (countryCode?: string) => void;

  // Currency functionality (fiat)
  fiatDropdownList: DropDownItemProps[];
  selectedFiatCurrency?: IFiatCurrency;
  handleFiatCurrencyChange: (id?: string) => void;

  // Crypto functionality
  cryptoDropdownList: DropDownItemProps[];
  selectedCrypto?: {
    __id: string;
    parentAssetId: string;
    assetId: string;
    name: string;
    abbr: string;
    network: string;
  };
  handleCryptoChange: (id?: string) => void;

  // Wallet functionality
  selectedWallet?: IWallet;
  handleWalletChange: (id?: string) => void;
  walletDropdownList: DropDownItemProps[];

  // Account functionality
  selectedAccount?: IAccount;
  handleAccountChange: (id?: string) => void;
  accountDropdownList: DropDownItemProps[];

  // Offers functionality
  offers: IOfferDetails[];
  filteredOffers: IOfferDetails[];
  isFetchingOffers: boolean;
  providers: IProviderDetails[];

  paymentMethodsDropdownList: DropDownItemProps[];

  amount: string;
  setAmount: (amount: string) => void;
  selectedOffer?: IOfferDetails;
  setSelectedOffer: (offer?: IOfferDetails) => void;
  receiveAmount: string;
  selectedPaymentMethod?: string;
  setSelectedPaymentMethod: (method: string) => void;

  // Order functionality
  createOrder: (address: string) => Promise<void>;
  order: MutableRefObject<ICreateOrderResult | undefined>;

  // Navigation functionality
  currentPage: BuySellPage;
  toPage: (page: BuySellPage) => void;
  toNextPage: () => void;
  toPreviousPage: () => void;
  onBack?: () => void;
  onRefresh?: () => void;
  setNavigationOptions: (options: {
    onBack?: () => void;
    onRefresh?: () => void;
  }) => void;

  retry: () => void;

  timerSeconds: number;
}

export interface BuySell2Props {
  children: ReactNode;
}

export const BuySell2Context: Context<BuySell2ContextInterface> =
  createContext<BuySell2ContextInterface>({} as BuySell2ContextInterface);

export interface BuySell2ContextProviderProps extends BuySell2Props {
  children: ReactNode;
}

export const BuySell2Provider: FC<BuySell2ContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell2.offers;

  // Timer for auto-refresh
  const [timerSeconds, setTimerSeconds] = useState(30);

  // Wallet selection
  const { wallets } = useAppSelector(selectWallets);
  const { selectedWallet, handleWalletChange, walletDropdownList } =
    useWalletDropdown({
      walletId: wallets[0]?.__id,
    });

  // Crypto selection
  const { cryptoDropdownList, selectedCrypto, handleCryptoChange } =
    useCryptoDropdown({
      defaultCryptoId: 'bitcoin/bitcoin',
    });

  // Country selection
  const { countryDropdownList, selectedCountry, handleCountryChange } =
    useCountryDropdown({
      defaultCountryCode: 'US',
    });

  // Currency Selection
  const { fiatDropdownList, selectedFiatCurrency, handleFiatCurrencyChange } =
    useFiatDropdown({
      defaultFiatCurrency: 'USD',
    });

  // Account list
  const { accounts } = useAppSelector(selectUnHiddenAccounts);

  const accountList: Record<string, IAccount> = useMemo(
    () => Object.fromEntries(accounts.map(a => [a.__id, a])),
    [accounts],
  );

  // Account Selection
  const {
    accountDropdownList: accountDropdownListSrc,
    selectedAccount,
    handleAccountChange,
  } = useAccountDropdown({
    selectedWallet,
  });

  const accountDropdownList = useMemo(
    () =>
      accountDropdownListSrc
        .filter(
          a =>
            a.id &&
            accountList[a.id] &&
            selectedCrypto &&
            (selectedCrypto.assetId === accountList[a.id].assetId ||
              selectedCrypto.parentAssetId === accountList[a.id].assetId),
        )
        .map(a => {
          const account = a.id ? accountList[a.id] : undefined;
          const shortForm = account
            ? getAsset(account.parentAssetId, account.assetId).abbr
            : undefined;

          return {
            ...a,
            shortForm,
            showRightTextOnBottom: undefined,
          };
        }),
    [accountDropdownListSrc, accountList, selectedCrypto],
  );

  useEffect(() => {
    if (selectedAccount?.assetId !== selectedCrypto?.parentAssetId) {
      handleAccountChange();
    }
  }, [accountDropdownList]);

  const [amount, setAmount] = useState('100');

  // Navigation options
  const [onBack, setOnBack] = useState<(() => void) | undefined>(undefined);
  const [onRefresh, setOnRefresh] = useState<(() => void) | undefined>(
    undefined,
  );

  const setNavigationOptions = (options: {
    onBack?: () => void;
    onRefresh?: () => void;
  }) => {
    setOnBack(() => options.onBack);
    setOnRefresh(() => options.onRefresh);
  };

  // Offers state
  const [getOffersResponse, setGetOffersResponse] = useState<
    IGetOffersResponse | undefined
  >();
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);

  const offers = getOffersResponse?.data?.offers ?? [];
  const providers = getOffersResponse?.data?.providers ?? [];

  // Payment method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();

  const filteredOffers = useMemo(
    () =>
      offers.filter(
        offer => offer.paymentMethod.code === selectedPaymentMethod,
      ),
    [selectedPaymentMethod, offers],
  );

  const paymentMethods = useMemo(
    () =>
      lodash.uniqBy(
        offers.map(offer => offer.paymentMethod),
        'code',
      ),
    [offers],
  );

  const bestPaymentMethod = offers[0]?.paymentMethod?.code;

  const paymentMethodsDropdownList: DropDownItemProps[] = paymentMethods.map(
    method => ({
      id: method.code,
      checkType: 'radio',
      text: method.name,
      rightText: ' ',
      rightIcon:
        method.code === bestPaymentMethod ? (
          <Typography color="gold" $whiteSpace="nowrap">
            {strings.bestOfferText}
          </Typography>
        ) : undefined,
    }),
  );

  const [selectedOffer, setSelectedOffer] = useState<
    IOfferDetails | undefined
  >();

  useEffect(() => {
    if (selectedPaymentMethod !== bestPaymentMethod) {
      setSelectedPaymentMethod(bestPaymentMethod);
    }
  }, [getOffersResponse, bestPaymentMethod]);

  useEffect(() => {
    const bestOffer = filteredOffers[0] as IOfferDetails | undefined;
    if (bestOffer?.id !== selectedOffer?.id) {
      setSelectedOffer(bestOffer);
    }
  }, [filteredOffers]);

  const receiveAmount = selectedOffer?.toAmount ?? '0';

  const order = useRef<ICreateOrderResult | undefined>();

  const createOrder = async (address: string) => {
    if (
      !selectedFiatCurrency ||
      !selectedCrypto ||
      !selectedOffer ||
      !selectedPaymentMethod
    ) {
      order.current = undefined;
      return;
    }

    const result = await buySellSupport.createOrder({
      amount,
      fromCurrency: selectedFiatCurrency.code,
      network: selectedCrypto.network,
      paymentMethod: selectedPaymentMethod,
      provider: selectedOffer.provider,
      receiverAddress: address,
      toCurrency: selectedCrypto.abbr,
      country: selectedCountry?.code,
      extra: {},
    });
    if (result.success && result.data) {
      const db = getDB();

      // Save order to database
      const dbOrder: IBuySellOrder = {
        id: result.data.id,
        provider: selectedOffer.provider,
        paymentMethod: {
          code: selectedPaymentMethod,
          name: selectedOffer.paymentMethod.name,
        },
        currencyFrom: selectedFiatCurrency.code,
        amountFrom: amount,
        amountTo: selectedOffer.toAmount,
        country: selectedCountry?.code ?? '',
        status: BuySellStatusMap.created,
        accountId: selectedAccount?.__id ?? '',
        walletId: selectedWallet?.__id ?? '',
        assetId: selectedCrypto.assetId,
        familyId: selectedAccount?.familyId ?? '',
        parentAssetId: selectedCrypto.parentAssetId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await insertBuySellOrder(db, dbOrder);
      order.current = result.data;
    }
  };

  // Navigation
  const {
    currentPage,
    toNextPage,
    toPreviousPage,
    reset: resetNavigation,
    toPage,
  } = useNavigation();

  const buySellSupport = new BuySellSupport2();

  const controllerRef = useRef<AbortController | null>(null);

  // Fetch offers
  const fetchOffers = async (
    fromCurrency?: string,
    toCurrency?: string,
    network?: string,
    fromAmount?: string,
    country?: string,
  ) => {
    if (!fromCurrency || !toCurrency || !fromAmount || !network) {
      setGetOffersResponse(undefined);
      setIsFetchingOffers(false);
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    setIsFetchingOffers(true);

    try {
      const result = await buySellSupport.getOffers({
        fromCurrency,
        toCurrency,
        network,
        amount: fromAmount,
        country,
      });
      if (controllerRef.current?.signal.aborted) return;
      setGetOffersResponse(result);
    } catch (e: unknown) {
      setGetOffersResponse(undefined);
    } finally {
      setIsFetchingOffers(false);
    }
  };

  const debouncedFetchOffers = useCallback(
    lodash.debounce(fetchOffers, 500),
    [],
  );

  useEffect(() => {
    debouncedFetchOffers(
      selectedFiatCurrency?.code,
      selectedCrypto?.abbr,
      selectedCrypto?.network,
      amount,
      selectedCountry?.code,
    );

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [
    selectedFiatCurrency,
    selectedCrypto,
    amount,
    selectedCountry,
    debouncedFetchOffers,
  ]);

  const resetUserInput = () => {
    handleCountryChange();
    handleFiatCurrencyChange();
    setAmount('');
    setGetOffersResponse(undefined);
    setSelectedOffer(undefined);
    setSelectedPaymentMethod('card');
    setOnBack(undefined);
    setOnRefresh(undefined);
  };

  const resetState = () => {
    resetNavigation();
  };

  const resetAll = () => {
    order.current = undefined;
    resetUserInput();
    resetState();
  };

  const retry = () => {
    if (selectedFiatCurrency && selectedCrypto && selectedCountry && amount) {
      debouncedFetchOffers(
        selectedFiatCurrency.code,
        selectedCrypto.abbr,
        selectedCrypto.network,
        amount,
        selectedCountry.code,
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => setTimerSeconds(s => Math.max(s - 1, 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerSeconds === 0) {
      retry();
      setTimerSeconds(30);
    }
  }, [timerSeconds, retry]);

  useEffect(() => {
    if (!isFetchingOffers && getOffersResponse) {
      setTimerSeconds(30);
    }
  }, [isFetchingOffers, getOffersResponse]);

  const ctx = useMemoReturn<BuySell2ContextInterface>({
    reset: resetAll,

    walletDropdownList,
    selectedWallet,
    handleWalletChange,

    accountDropdownList,
    selectedAccount,
    handleAccountChange,

    cryptoDropdownList,
    selectedCrypto,
    handleCryptoChange,

    countryDropdownList,
    selectedCountry,
    handleCountryChange,

    fiatDropdownList,
    selectedFiatCurrency,
    handleFiatCurrencyChange,

    amount,
    setAmount,

    isFetchingOffers,
    offers,
    filteredOffers,
    providers,
    paymentMethodsDropdownList,

    selectedOffer,
    setSelectedOffer,
    receiveAmount,

    selectedPaymentMethod,
    setSelectedPaymentMethod,

    createOrder,
    order,

    currentPage,
    toNextPage,
    toPreviousPage,
    toPage,

    onBack,
    onRefresh,
    setNavigationOptions,

    retry,

    timerSeconds,
  });

  return (
    <BuySell2Context.Provider value={ctx}>{children}</BuySell2Context.Provider>
  );
};

export function useBuySell2(): BuySell2ContextInterface {
  return useContext(BuySell2Context);
}
