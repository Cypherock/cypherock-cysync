import {
  Button,
  Container,
  Flex,
  MessageBox,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import { BuySellSupport2 } from '@cypherock/app-support-buy-sell-2';
import lodash from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';

import { openAddAccountDialog } from '~/actions';
import { useBuySell2 } from '~/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import {
  CryptoSelector,
  RegionCurrencySelector,
  AmountInput,
  Offers,
  PaymentMethodSelector,
} from '../components';
import { BuySellOffersHeader } from '../components/BuySellOffersHeader';
import { WalletAccountSelector } from '../components/WalletAccountSelector';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

export const BuySellInput: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    selectedCrypto,
    selectedFiatCurrency,
    selectedCountry,
    amount,
    accountDropdownList,
    selectedOffer,
    selectedAccount,
    toNextPage,
    setNavigationOptions,
    isFetchingOffers,
    offers,
    setGetOffersResponse,
    setIsFetchingOffers,
    timerSeconds,
    setTimerSeconds,
  } = useBuySell2();

  const buySellSupport = new BuySellSupport2();
  const controllerRef = useRef<AbortController | null>(null);

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

    analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_OFFERS_REQUESTED, {
      fromCurrency,
      toCurrency,
      network,
    });

    try {
      const result = await buySellSupport.getOffers({
        fromCurrency,
        toCurrency,
        network,
        amount: fromAmount,
        country,
      });
      if (controllerRef.current?.signal.aborted) return;

      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_OFFERS_RECEIVED, {
        fromCurrency,
        toCurrency,
        network,
      });
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

  const handleRetry = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((s: number) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [setTimerSeconds]);

  useEffect(() => {
    if (timerSeconds === 0) {
      handleRetry();
      setTimerSeconds(30);
    }
  }, [timerSeconds, handleRetry, setTimerSeconds]);

  useEffect(() => {
    if (!isFetchingOffers && offers.length > 0) {
      setTimerSeconds(30);
    }
  }, [isFetchingOffers, offers, setTimerSeconds]);

  useEffect(() => {
    setNavigationOptions({
      onRefresh: handleRetry,
    });

    return () => {
      setNavigationOptions({});
    };
  }, [handleRetry]);

  const { strings: langStrings } = useAppSelector(selectLanguage);

  const strings = {
    offersSection: langStrings.buySell2.input.offersSection,
    accounts: langStrings.buySell2.input.accounts,
    messageBox: langStrings.buySell2.input.messageBox,
    errors: langStrings.buySell2.input.errors,
  };

  const canShowOffers = !isFetchingOffers && offers.length > 0;
  const canCreateOrder = selectedOffer && selectedAccount;

  const getText = () => {
    if (isFetchingOffers) {
      return [strings.offersSection.searchingForOffers];
    }

    if (!canShowOffers && offers.length === 0) {
      return [strings.errors.noOffers];
    }

    if (canShowOffers && !canCreateOrder) {
      const messages = [];

      if (!selectedOffer) {
        messages.push(strings.offersSection.selectAnOffer);
      }

      if (!selectedAccount) {
        messages.push(strings.accounts.selectAnAccount);
      }

      return messages;
    }

    return [];
  };

  const messages = () => (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap={16}
      $bgColor="separator"
      p="20px"
      $borderRadius="8px"
      width="full"
    >
      {getText().map((t, index) => (
        <Typography
          key={`${index + 1}`}
          color="muted"
          $textAlign="center"
          width="full"
          $allowOverflow
          display="flex"
          align="center"
          justify="center"
          gap={8}
        >
          {isFetchingOffers && throbber} {t}
        </Typography>
      ))}
    </Flex>
  );

  return (
    <Container
      $borderRadius={24}
      shadow="popup"
      direction="row"
      align="stretch"
      $borderWidth={1}
      $overflowX="hidden"
      height="full"
      $bgColor="primary"
      mx="20"
      width="-webkit-fill-available"
    >
      <Flex
        gap={16}
        p={4}
        px={5}
        height="fit-content"
        direction="column"
        $flex={1}
        $minWidth="0"
      >
        <Flex
          p={3}
          gap={16}
          direction="column"
          $bgColor="lightBlack"
          $borderRadius={8}
          $borderWidth={0}
        >
          <RegionCurrencySelector />
          <AmountInput />
          <PaymentMethodSelector />
        </Flex>

        <Flex
          p={3}
          gap={16}
          direction="column"
          $bgColor="lightBlack"
          $borderRadius={8}
          $borderWidth={0}
        >
          <CryptoSelector />
          <WalletAccountSelector />
        </Flex>

        {selectedWallet &&
          selectedCrypto &&
          accountDropdownList.length === 0 && (
            <MessageBox
              type="danger"
              text={strings.messageBox.danger}
              altText={`${selectedCrypto.name} ${strings.messageBox.altText} ${selectedWallet.name}`}
              actionButton={
                <Button
                  variant="text"
                  onClick={() =>
                    dispatch(
                      openAddAccountDialog({
                        coinId: selectedCrypto.parentAssetId,
                        walletId: selectedWallet.__id,
                      }),
                    )
                  }
                >
                  <Typography color="gold">
                    {langStrings.buttons.addAccount}
                  </Typography>
                </Button>
              }
            />
          )}
      </Flex>

      <Flex
        $bgColor="list"
        width={400}
        py={4}
        px={5}
        justify="space-between"
        direction="column"
        $borderWidthL={1}
      >
        <Flex direction="column" gap={24}>
          <BuySellOffersHeader size={offers.length} />

          {!canShowOffers && messages()}
          {canShowOffers && <Offers />}
        </Flex>

        <Flex direction="column" gap={8}>
          {canShowOffers && !canCreateOrder && messages()}

          <Flex py={3} $borderWidthT={1}>
            <Button
              width="full"
              variant="primary"
              display="inline-block"
              disabled={!canCreateOrder}
              onClick={toNextPage}
            >
              {langStrings.buttons.continue}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
