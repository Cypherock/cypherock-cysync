// TODO: refactor this file into multiple components
import {
  formatDisplayPrice,
  getParsedAmount,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import { ServerErrorType } from '@cypherock/cysync-core-constants';
import {
  Container,
  LangDisplay,
  Button,
  Flex,
  Image,
  Dropdown,
  Input,
  Typography,
  VectorIcon,
  CustomInputSend,
  Throbber,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import { BigNumber, formatSecondsToMinutes } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { IQuote, useSwap } from '~/context';
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { getQuotes } from '~/services/swapService';
import { useAppSelector, selectLanguage, selectPriceInfos } from '~/store';
import { createServerErrorFromError } from '~/utils';
import logger from '~/utils/logger';

const getEarliestExpiryTime = (quotes: IQuote[]) =>
  Math.min(...quotes.map((quote: IQuote) => quote.validUntil));

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

const BestOfferTag = styled.div`
  background: ${({ theme }) => theme.palette.golden};
  border-radius: 36px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AmountInput: React.FC<any> = ({
  placeholder,
  amount,
  isDisabled,
  isLoading,
  coinUnit,
  setAmount,
  error,
}) => {
  const filterNumericInput = (val: string) => {
    let filteredValue = val.replace(/[^0-9.]/g, '');
    const bigNum = new BigNumber(filteredValue);

    if (filteredValue.includes('.')) {
      const splitValue = filteredValue.split('.');
      let firstValue = splitValue[0];
      const secondValue = splitValue[1];

      const firstValBigNumber = new BigNumber(firstValue);

      if (firstValBigNumber.isNaN() || firstValBigNumber.isZero()) {
        firstValue = '0';
      }

      filteredValue = `${firstValue}.${secondValue}`;
    } else if (!bigNum.isNaN() && bigNum.isZero()) {
      filteredValue = '0';
    }

    return filteredValue;
  };

  const handleCoinAmountChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setAmount(filteredValue);
  };

  return (
    <>
      <CustomInputSend error={error}>
        <Input
          type="text"
          name="amount"
          placeholder={placeholder}
          onChange={handleCoinAmountChange}
          value={amount}
          disabled={isDisabled}
          $textColor="white"
          $noBorder
        />
        {isLoading ? (
          throbber
        ) : (
          <Typography $fontSize={16} color="muted" $allowOverflow>
            {coinUnit}
          </Typography>
        )}
      </CustomInputSend>
      {error && (
        <Typography
          variant="span"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          {error}
        </Typography>
      )}
    </>
  );
};

const AmountAndAccountSelection: React.FC<any> = ({
  selectionLabel,
  amountLabel,
  accountPlaceholder,
  selectedWallet,
  handleWalletChange,
  walletDropdownList,
  selectedAccount,
  handleAccountChange,
  accountDropdownList,
  amount,
  setAmount,
  isAmountDisabled,
  amountError,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dialogText = lang.strings.swap.detailsInput.common;

  const { priceInfos } = useAppSelector(selectPriceInfos);

  const coinUnit = useMemo(() => {
    const account = selectedAccount;

    if (!account) return '';

    const unit =
      account.unit ??
      getDefaultUnit(account.parentAssetId, account.assetId).abbr;
    return unit;
  }, [selectedAccount]);

  const coinValue = useMemo(() => {
    const account = selectedAccount;
    if (!account) return '';

    const assetPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );

    if (!assetPrice) return '';

    const validAmount = amount ?? '0';
    const amountValue = new BigNumber(validAmount).multipliedBy(
      assetPrice.latestPrice,
    );

    const value = formatDisplayPrice(amountValue);

    return `$${value}`;
  }, [selectedAccount, amount]);

  return (
    <Flex direction="column" gap={16} $minWidth="420px">
      <Flex direction="column" gap={8}>
        <Typography $fontSize={12} color="muted">
          {selectionLabel}
        </Typography>
        <Dropdown
          items={walletDropdownList}
          selectedItem={selectedWallet?.__id}
          searchText={dialogText.searchText}
          placeholderText={dialogText.walletPlaceholder}
          onChange={handleWalletChange}
          noLeftImageInList
        />
        <Dropdown
          items={accountDropdownList}
          selectedItem={selectedAccount?.__id}
          disabled={!selectedWallet}
          searchText={dialogText.searchText}
          placeholderText={accountPlaceholder}
          onChange={handleAccountChange}
        />
      </Flex>
      <Flex direction="column" gap={8}>
        <Flex align="center" justify="space-between">
          <Typography $fontSize={12} color="muted">
            {amountLabel}
          </Typography>
          <Typography $fontSize={14} color="muted">
            {coinValue}
          </Typography>
        </Flex>
        <AmountInput
          placeholder="0"
          amount={amount}
          setAmount={setAmount}
          isDisabled={!selectedAccount || isAmountDisabled}
          error={amountError}
          coinUnit={coinUnit}
        />
      </Flex>
    </Flex>
  );
};

const OfferBox: React.FC<any> = ({
  selectedIndex,
  setSelectedIndex,
  offerData,
}) => (
  <Flex
    p="20px"
    px={2}
    gap={16}
    direction="column"
    $borderRadius={8}
    $borderColor={selectedIndex === offerData.index ? 'gold' : 'card'}
    $borderWidth={1}
    onClick={() => {
      setSelectedIndex(offerData.index);
    }}
  >
    <Flex justify="space-between" align="center">
      <Flex gap={8} align="center">
        <Image
          src={offerData?.provider?.imageUrl ?? ''}
          alt="Logo"
          $width={32}
          $height={32}
        />
        <Typography $fontSize={14}>{offerData.provider.name}</Typography>
      </Flex>
      {offerData.isBest && (
        <BestOfferTag>
          <Typography
            $fontFamily="monospace"
            $fontWeight="semibold"
            $fontSize={10}
            color="black"
            $lineHeight="normal"
            $allowOverflow
          >
            {offerData.bestOfferText}
          </Typography>
        </BestOfferTag>
      )}
    </Flex>
    <Flex direction="column">
      {offerData?.data?.map((data: any) => (
        <Flex justify="space-between" align="center" key={data.title}>
          <Flex gap={8} align="center">
            <Typography $fontSize={14}>{data.title}</Typography>
          </Flex>
          <Flex gap={8} align="center">
            <Typography $fontSize={14}>{data.value[0]}</Typography>
            <Typography $fontSize={12} color="muted">
              {data.value[1]}
            </Typography>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </Flex>
);

export const SwapQuotesHeader: React.FC<{
  size: number;
  validUntil: number;
  onTimeEnd: () => void;
}> = ({ size, onTimeEnd, validUntil }) => {
  const totalSeconds = validUntil
    ? Math.floor((validUntil - new Date().getTime()) / 1000)
    : 0;
  const [seconds, setSeconds] = useState(totalSeconds);

  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.swap.detailsInput.offers;

  useEffect(() => {
    const interval = setInterval(
      () => setSeconds(s => Math.max(s - 1, 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds <= 1) onTimeEnd();
  }, [seconds]);

  const remainingTime = useMemo(
    () => formatSecondsToMinutes(seconds),
    [seconds],
  );

  return (
    <Typography
      color="muted"
      justify="space-between"
      display="flex"
      $allowOverflow
    >
      <span>{parseLangTemplate(displayText.quotesFound, { num: size })}</span>
      <span>
        {parseLangTemplate(displayText.timerText, { time: remainingTime })}
      </span>
    </Typography>
  );
};

export const SwapQuotes: React.FC<{
  quotes: IQuote[];
  setSelectedOfferIndex: (val: number) => void;
  selectedOfferIndex?: number;
  toAccount?: IAccount;
  fromAccount?: IAccount;
  findNewQuotes: () => void;
  hasEnoughBalance: boolean;
}> = ({
  quotes,
  setSelectedOfferIndex,
  selectedOfferIndex,
  toAccount,
  fromAccount,
  findNewQuotes,
  hasEnoughBalance,
}) => {
  const { toNextPage, fillDetails } = useSwap();
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.swap.detailsInput.offers;

  return (
    <>
      <SwapQuotesHeader
        size={quotes.length}
        onTimeEnd={findNewQuotes}
        validUntil={getEarliestExpiryTime(quotes)}
      />
      {quotes.map((quote, index) => {
        const fromUnit = getDefaultUnit(
          fromAccount?.parentAssetId ?? '',
          fromAccount?.assetId,
        ).abbr;

        const toUnit = getDefaultUnit(
          toAccount?.parentAssetId ?? '',
          toAccount?.assetId,
        ).abbr;

        const rate = new BigNumber(quote.toAmount)
          .dividedBy(quote.fromAmount)
          .toFixed(6);

        return (
          <OfferBox
            offerData={{
              index,
              data: [
                {
                  title: displayText.fixedRate,
                  value: [`1 ${fromUnit} =`, `${rate} ${toUnit}`],
                },
              ],
              isBest: index === 0,
              bestOfferText: displayText.bestOffer,
              provider: quote.provider,
            }}
            setSelectedIndex={setSelectedOfferIndex}
            selectedIndex={selectedOfferIndex}
            key={quote.id}
          />
        );
      })}
      {quotes.length === 0 && displayText.errors.noQuotes}
      <Button
        variant="primary"
        disabled={
          selectedOfferIndex === undefined ||
          selectedOfferIndex >= quotes.length ||
          !hasEnoughBalance
        }
        onClick={() => {
          if (
            !fromAccount ||
            !toAccount ||
            (selectedOfferIndex ?? 0) >= quotes.length
          ) {
            return;
          }
          const quote = quotes[selectedOfferIndex ?? 0];
          fillDetails({
            from: fromAccount,
            to: toAccount,
            quote,
          });
          toNextPage();
        }}
        display="inline-block"
      >
        <LangDisplay text={displayText.buttons.continue} />
      </Button>
    </>
  );
};

SwapQuotes.defaultProps = {
  selectedOfferIndex: undefined,
  toAccount: undefined,
  fromAccount: undefined,
};

export const SwapDetailsInput = () => {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<
    number | undefined
  >();
  const fromWallet = useWalletDropdown();
  const fromAccount = useAccountDropdown({
    selectedWallet: fromWallet.selectedWallet,
    includeSubAccounts: true,
  });

  const [fromAmount, setFromAmount] = useState('0');

  const toWallet = useWalletDropdown();
  const toAccount = useAccountDropdown({
    selectedWallet: toWallet.selectedWallet,
    includeSubAccounts: true,
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
        fromAccount.selectedAccount?.spendableBalance ??
          fromAccount.selectedAccount?.balance ??
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

  useEffect(() => {
    if (
      fromWallet.selectedWallet === undefined ||
      fromAccount.selectedAccount === undefined
    ) {
      setFromAmount('0');
    }
  }, [fromWallet.selectedWallet, fromAccount.selectedAccount]);

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
    if (!isFetchingQuotes && quotes.length > 0) {
      return (
        <SwapQuotes
          quotes={quotes}
          setSelectedOfferIndex={setSelectedOfferIndex}
          selectedOfferIndex={selectedOfferIndex}
          toAccount={toAccount.selectedAccount}
          fromAccount={fromAccount.selectedAccount}
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
        return ['Enter amount to get quotes'];
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
          : 'Select a different coin pair',
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
          Your best quotes
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
            >
              {t}
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
      >
        <AmountAndAccountSelection
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
          >
            <VectorIcon />
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
