import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { ServerErrorType } from '@cypherock/cysync-core-constants';
import {
  Container,
  LangDisplay,
  Button,
  Flex,
  Typography,
  Throbber,
  parseLangTemplate,
  SwapIcon,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { IQuote, useSwap } from '~/context';
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { getQuotes } from '~/services/swapService';
import { useAppSelector, selectLanguage } from '~/store';
import { createServerErrorFromError } from '~/utils';
import logger from '~/utils/logger';

import { AmountAndAccountSelection, SwapQuotes } from '../components';

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

export const SwapDetailsInput = () => {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<
    number | undefined
  >();
  const {
    fromWallet: defaultFromWallet,
    fromAccount: defaultFromAccount,
    fromAmount: defaultFromAmount,
    toWallet: defaultToWallet,
    toAccount: defaultToAccount,
    resetIndex,
  } = useSwap();

  const [fromAmount, setFromAmount] = useState(() => defaultFromAmount);

  const fromWallet = useWalletDropdown({ walletId: defaultFromWallet?.__id });
  const fromAccount = useAccountDropdown({
    selectedWallet: fromWallet.selectedWallet,
    includeSubAccounts: true,
    defaultAccountId: defaultFromAccount?.__id,
  });

  const toWallet = useWalletDropdown({ walletId: defaultToWallet?.__id });
  const toAccount = useAccountDropdown({
    selectedWallet: toWallet.selectedWallet,
    includeSubAccounts: true,
    defaultAccountId: defaultToAccount?.__id,
  });

  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.swap.detailsInput;

  const hasEnoughBalance = useMemo(() => {
    if (fromAccount.selectedAccount === undefined || fromAmount === '')
      return true;
    const parsedAmount = getParsedAmount({
      coinId: fromAccount.selectedAccount.parentAssetId,
      assetId: fromAccount.selectedAccount.assetId,
      amount: new BigNumber(
        fromAccount.selectedAccount.spendableBalance ??
          fromAccount.selectedAccount.balance ??
          '0',
      ).toString(),
      unitAbbr:
        fromAccount.selectedAccount.unit ??
        getDefaultUnit(
          fromAccount.selectedAccount.parentAssetId,
          fromAccount.selectedAccount.assetId,
        ).abbr,
    }).amount;

    return new BigNumber(parsedAmount).isGreaterThan(fromAmount);
  }, [fromAccount.selectedAccount, fromAmount]);

  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [message, setMessage] = useState<string>();
  const calculatedAmount = useMemo(() => {
    if (quotes.length <= (selectedOfferIndex ?? 0)) {
      return '0';
    }
    return quotes[selectedOfferIndex ?? 0].toAmount;
  }, [quotes, selectedOfferIndex]);

  useEffect(() => {
    if (quotes.length === 0) {
      setSelectedOfferIndex(undefined);
      return;
    }
    setSelectedOfferIndex(0);
  }, [quotes]);

  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [range, setRange] = useState<{ min: string; max: string }>();

  const fetchQuotes = async (from: IAccount, to: IAccount, amount: string) => {
    let newQuotes: IQuote[] = [];
    let newRange;
    if (
      !(
        fromAccount !== undefined &&
        !new BigNumber(amount).isNaN() &&
        toAccount !== undefined
      )
    ) {
      setQuotes(newQuotes);
      setRange(undefined);
      setIsFetchingQuotes(false);
      return;
    }

    try {
      const result = await getQuotes({
        fromCurrency: from.assetId,
        fromNetwork: from.parentAssetId,
        toCurrency: to.assetId,
        toNetwork: to.parentAssetId,
        amount,
      });

      if (result.status === 200) {
        newQuotes = result.data.data;
        newRange = result.data?.metadata?.range;
      }
      logger.info(`Received quotes result from server: ${result.data}`);
    } catch (e) {
      const serverError = createServerErrorFromError(e);
      if (serverError?.code === ServerErrorType.CONNOT_CONNECT) {
        setMessage(displayText.offers.errors.noInternet);
      }
      logger.error(e);
    }

    setRange(newRange);
    setQuotes(newQuotes);
    setIsFetchingQuotes(false);
  };

  const debouncedGetQuotes = useCallback(lodash.debounce(fetchQuotes, 500), []);

  const findNewQuotes = () => {
    setIsFetchingQuotes(true);
    setMessage(undefined);
    debouncedGetQuotes(
      fromAccount.selectedAccount!,
      toAccount.selectedAccount!,
      fromAmount,
    );
  };

  useEffect(findNewQuotes, [
    fromAccount.selectedAccount,
    fromAmount,
    toAccount.selectedAccount,
  ]);

  function resetSwapInputDetails() {
    setFromAmount('0');
    fromAccount.setSelectedAccount(undefined);
    fromWallet.setSelectedWallet(undefined);
    toAccount.setSelectedAccount(undefined);
    toWallet.setSelectedWallet(undefined);
  }

  const isFirstRender = useRef(true);
  const prevResetIndex = useRef<number>(resetIndex);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevResetIndex.current = resetIndex;
      return;
    }
    if (prevResetIndex.current !== resetIndex) {
      resetSwapInputDetails();
      prevResetIndex.current = resetIndex;
    }
  }, [resetIndex]);

  const swapToAndFrom = () => {
    const intermediateWalletId = toWallet.selectedWallet?.__id;
    const intermediateAccountId = toAccount.selectedAccount?.__id;
    const intermediateAmount = calculatedAmount;

    toWallet.handleWalletChange(fromWallet.selectedWallet?.__id);
    toAccount.handleAccountChange(fromAccount.selectedAccount?.__id);
    findNewQuotes();

    fromWallet.handleWalletChange(intermediateWalletId);
    fromAccount.handleAccountChange(intermediateAccountId);
    setFromAmount(intermediateAmount);
  };

  const sideComponent = useMemo(() => {
    const canShowQuotes =
      !isFetchingQuotes &&
      quotes.length > 0 &&
      fromWallet.selectedWallet &&
      toWallet.selectedWallet &&
      fromAccount.selectedAccount &&
      toAccount.selectedAccount;

    if (canShowQuotes) {
      return (
        <SwapQuotes
          quotes={quotes}
          setSelectedOfferIndex={setSelectedOfferIndex}
          selectedOfferIndex={selectedOfferIndex}
          fromWallet={fromWallet.selectedWallet}
          toWallet={toWallet.selectedWallet}
          toAccount={toAccount.selectedAccount}
          fromAccount={fromAccount.selectedAccount}
          fromAmount={fromAmount}
          findNewQuotes={findNewQuotes}
          hasEnoughBalance={hasEnoughBalance}
        />
      );
    }

    const getText = () => {
      if (isFetchingQuotes) {
        return [displayText.offers.searchingForOffers];
      }

      if (
        fromAccount.selectedAccount === undefined ||
        toAccount.selectedAccount === undefined
      ) {
        return [displayText.offers.initialText];
      }

      if (
        fromAccount.selectedAccount.assetId ===
        toAccount.selectedAccount.assetId
      ) {
        return [displayText.offers.errors.sameAsset];
      }

      if (new BigNumber(fromAmount).isNaN()) {
        return [displayText.offers.errors.enterAmount];
      }

      if (message) {
        return [message];
      }

      return [
        displayText.offers.errors.noOffers,
        range
          ? parseLangTemplate(displayText.offers.errors.amountRange, {
              min: range.min,
              max: range.max,
            })
          : displayText.offers.errors.selectDifferentCoinPair,
      ];
    };

    return (
      <Flex direction="column" align="flex-start" gap={24} $alignSelf="stretch">
        <Typography
          key="title-text"
          color="muted"
          display="flex"
          $allowOverflow
        >
          {displayText.offers.title}
        </Typography>
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
              {isFetchingQuotes && throbber} {t}
            </Typography>
          ))}
        </Flex>
        <Button variant="primary" disabled display="inline-block" width="full">
          <LangDisplay text={displayText.offers.buttons.continue} />
        </Button>
      </Flex>
    );
  }, [
    range,
    quotes,
    setSelectedOfferIndex,
    selectedOfferIndex,
    toAccount,
    fromAccount,
    findNewQuotes,
    isFetchingQuotes,
  ]);

  return (
    <Container
      m="20"
      $borderRadius={24}
      shadow="popup"
      direction="row"
      align="stretch"
      $borderWidth={0}
      $overflow="hidden"
      height="full"
    >
      <Flex
        gap={16}
        p={5}
        px={4}
        height="fit-content"
        direction="column"
        $flex={5}
        $minWidth="0"
      >
        <AmountAndAccountSelection
          key={`from-${resetIndex}`}
          selectionLabel={displayText.from.title}
          amountLabel={displayText.from.amountLabel}
          accountPlaceholder={displayText.from.accountPlaceholder}
          handleWalletChange={fromWallet.handleWalletChange}
          walletDropdownList={fromWallet.walletDropdownList}
          selectedWallet={fromWallet.selectedWallet}
          selectedAccount={fromAccount.selectedAccount}
          handleAccountChange={fromAccount.handleAccountChange}
          accountDropdownList={fromAccount.accountDropdownList}
          amount={fromAmount}
          setAmount={setFromAmount}
          amountError={
            !hasEnoughBalance ? displayText.from.amountError : undefined
          }
          autoFocus
        />
        <div style={{ alignSelf: 'center' }}>
          <Button
            variant="icon"
            disabled={
              fromAccount.selectedAccount === undefined &&
              toAccount.selectedAccount === undefined
            }
            onClick={() => {
              swapToAndFrom();
            }}
            width={32}
            height={32}
            display="flex"
            align="center"
            justify="center"
            $borderRadius="4px"
            $borderColor="input"
            $bgColor="separator"
          >
            <SwapIcon />
          </Button>
        </div>
        <AmountAndAccountSelection
          selectionLabel={displayText.to.title}
          amountLabel={displayText.to.amountLabel}
          accountPlaceholder={displayText.to.accountPlaceholder}
          handleWalletChange={toWallet.handleWalletChange}
          walletDropdownList={toWallet.walletDropdownList}
          selectedWallet={toWallet.selectedWallet}
          selectedAccount={toAccount.selectedAccount}
          handleAccountChange={toAccount.handleAccountChange}
          accountDropdownList={toAccount.accountDropdownList}
          amount={calculatedAmount}
          isAmountDisabled
        />
      </Flex>
      <Flex
        $bgColor="list"
        $flex={3}
        gap={24}
        p={5}
        px={4}
        direction="column"
        $overflow="auto"
      >
        {sideComponent}
      </Flex>
    </Container>
  );
};
