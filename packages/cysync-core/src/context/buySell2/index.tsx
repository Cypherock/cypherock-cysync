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
  Dispatch,
  SetStateAction,
} from 'react';

import { getPaymentMethodIcon } from '~/constants';
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
  setGetOffersResponse: (response: IGetOffersResponse | undefined) => void;
  setIsFetchingOffers: (isFetching: boolean) => void;
  setTimerSeconds: Dispatch<SetStateAction<number>>;

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

  const [timerSeconds, setTimerSeconds] = useState(30);

  const { wallets } = useAppSelector(selectWallets);
  const { selectedWallet, handleWalletChange, walletDropdownList } =
    useWalletDropdown({
      walletId: wallets[0]?.__id,
    });

  const { cryptoDropdownList, selectedCrypto, handleCryptoChange } =
    useCryptoDropdown({
      defaultCryptoId: 'bitcoin/bitcoin',
    });

  const { countryDropdownList, selectedCountry, handleCountryChange } =
    useCountryDropdown({
      defaultCountryCode: 'US',
    });

  const { fiatDropdownList, selectedFiatCurrency, handleFiatCurrencyChange } =
    useFiatDropdown({
      defaultFiatCurrency: 'USD',
    });

  const { accounts } = useAppSelector(selectUnHiddenAccounts);

  const accountList: Record<string, IAccount> = useMemo(
    () => Object.fromEntries(accounts.map(a => [a.__id, a])),
    [accounts],
  );

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

  const [getOffersResponse, setGetOffersResponse] = useState<
    IGetOffersResponse | undefined
  >();
  const [isFetchingOffers, setIsFetchingOffers] = useState(false);
  const setIsFetchingOffersState = (isFetching: boolean) => {
    setIsFetchingOffers(isFetching);
  };

  const offers = getOffersResponse?.data?.offers ?? [];
  const providers = getOffersResponse?.data?.providers ?? [];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();

  const normalizePaymentMethodCode = (code: string): string => {
    const normalizationMap: Record<string, string> = {
      BUY_CARD: 'card',
      BUY_APPLE_PAY: 'apple_pay',
      BUY_GOOGLE_PAY: 'google_pay',
      BUY_REVOLUT: 'revolut',
      BUY_P2P: 'p2p',
    };

    if (normalizationMap[code]) {
      return normalizationMap[code];
    }

    return code.toLowerCase();
  };

  const getPaymentMethodKey = (offer: IOfferDetails): string => {
    const normalizedCode = normalizePaymentMethodCode(offer.paymentMethod.code);

    if (
      offer.provider === 'binance' &&
      offer.extra?.payMethodSubCode &&
      normalizedCode === 'p2p'
    ) {
      return `${normalizedCode}_${offer.extra.payMethodSubCode}`;
    }

    return normalizedCode;
  };

  const filteredOffers = useMemo(() => {
    if (!selectedPaymentMethod) return offers;

    return offers.filter(offer => {
      const offerKey = getPaymentMethodKey(offer);
      return offerKey === selectedPaymentMethod;
    });
  }, [selectedPaymentMethod, offers]);

  const paymentMethods = useMemo(() => {
    const grouped = new Map<
      string,
      {
        code: string;
        name: string;
        originalCodes: string[];
        uniqueNames: Set<string>;
        payMethodSubCode?: string;
      }
    >();

    offers.forEach(offer => {
      const key = getPaymentMethodKey(offer);
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          code: key,
          name: offer.paymentMethod.name,
          originalCodes: [offer.paymentMethod.code],
          uniqueNames: new Set([offer.paymentMethod.name]),
          payMethodSubCode: offer.extra?.payMethodSubCode,
        });
      } else {
        existing.uniqueNames.add(offer.paymentMethod.name);

        const currentIsBuyPrefixed =
          offer.paymentMethod.code.startsWith('BUY_');
        const existingIsBuyPrefixed =
          existing.originalCodes[0].startsWith('BUY_');

        if (!currentIsBuyPrefixed && existingIsBuyPrefixed) {
          existing.name = offer.paymentMethod.name;
        }

        if (!existing.originalCodes.includes(offer.paymentMethod.code)) {
          existing.originalCodes.push(offer.paymentMethod.code);
        }
      }
    });

    return Array.from(grouped.values()).map(({ code, name, uniqueNames }) => {
      if (code === 'p2p' && uniqueNames.size > 1) {
        return {
          code,
          name: 'P2P',
        };
      }

      return {
        code,
        name,
      };
    });
  }, [offers]);

  const bestPaymentMethod = offers[0]
    ? getPaymentMethodKey(offers[0])
    : undefined;

  const paymentMethodsDropdownList: DropDownItemProps[] = paymentMethods.map(
    method => {
      const baseCode = method.code.split('_')[0];
      const icon = getPaymentMethodIcon(baseCode);
      return {
        id: method.code,
        checkType: 'radio',
        text: icon ? `${icon} ${method.name}` : method.name,
        rightText: ' ',
        rightIcon:
          method.code === bestPaymentMethod ? (
            <Typography color="gold" $whiteSpace="nowrap">
              {strings.bestOfferText}
            </Typography>
          ) : undefined,
      };
    },
  );

  const [selectedOffer, setSelectedOffer] = useState<
    IOfferDetails | undefined
  >();

  useEffect(() => {
    handleAccountChange();
  }, [selectedWallet, selectedCrypto]);

  useEffect(() => {
    setSelectedPaymentMethod(bestPaymentMethod);
    setSelectedOffer(undefined);
  }, [offers]);

  useEffect(() => {
    if (
      !selectedPaymentMethod ||
      (bestPaymentMethod &&
        selectedPaymentMethod !== bestPaymentMethod &&
        !paymentMethods.find(method => method.code === selectedPaymentMethod))
    ) {
      setSelectedPaymentMethod(bestPaymentMethod);
    }
  }, [
    getOffersResponse,
    bestPaymentMethod,
    selectedPaymentMethod,
    paymentMethods,
  ]);

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
      paymentMethod: selectedOffer.paymentMethod.code,
      provider: selectedOffer.provider,
      receiverAddress: address,
      toCurrency: selectedCrypto.abbr,
      country: selectedCountry?.code,
      extra: selectedOffer.extra?.payMethodSubCode
        ? { payMethodSubCode: selectedOffer.extra.payMethodSubCode }
        : {},
    });
    if (result.success && result.data) {
      const db = getDB();

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
    } else {
      order.current = undefined;
    }
  };

  const {
    currentPage,
    toNextPage,
    toPreviousPage,
    reset: resetNavigation,
    toPage,
  } = useNavigation();

  const buySellSupport = new BuySellSupport2();

  const resetUserInput = () => {
    handleCountryChange();
    handleFiatCurrencyChange();
    handleAccountChange();
    setAmount('');
    setGetOffersResponse(undefined);
    setSelectedOffer(undefined);
    setSelectedPaymentMethod('card');
    setOnBack(undefined);
    setOnRefresh(undefined);
    setIsFetchingOffers(false);
  };

  const resetState = () => {
    resetNavigation();
  };

  const resetAll = () => {
    order.current = undefined;
    resetUserInput();
    resetState();
  };

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
    setGetOffersResponse,
    setIsFetchingOffers: setIsFetchingOffersState,
    setTimerSeconds,
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

    timerSeconds,
  });

  return (
    <BuySell2Context.Provider value={ctx}>{children}</BuySell2Context.Provider>
  );
};

export function useBuySell2(): BuySell2ContextInterface {
  return useContext(BuySell2Context);
}
