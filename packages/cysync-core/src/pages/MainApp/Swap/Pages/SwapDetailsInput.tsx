/* eslint-disable */
// TODO: refactor this file into multiple components
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import {
  Container,
  LangDisplay,
  Button,
  Flex,
  Image,
  Dropdown,
  Input,
  Typography,
  GraphSwitchIcon,
  CustomInputSend,
  Throbber,
  Tag,
} from '@cypherock/cysync-ui';
import { BigNumber, formatSecondsToMinutes } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IQuote, useSwap } from '~/context';
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { getQuotes } from '~/services/swapService';

import { useAppSelector, selectLanguage } from '~/store';
import logger from '~/utils/logger';

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

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
  const dialogText = lang.strings.send.source;

  useEffect(() => {
    console.log({ selectedWallet, selectedAccount });
  }, [selectedWallet]);

  return (
    <Flex direction="column" gap={16}>
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
          placeholderText={dialogText.accountPlaceholder}
          onChange={handleAccountChange}
        />
      </Flex>
      <Flex direction="column" gap={8}>
        <Typography $fontSize={12} color="muted">
          {amountLabel}
        </Typography>
        <AmountInput
          placeholder="0"
          amount={amount}
          setAmount={setAmount}
          isDisabled={!selectedAccount || isAmountDisabled}
          error={amountError}
          coinUnit={
            selectedAccount
              ? selectedAccount.unit ??
                getDefaultUnit(
                  selectedAccount.parentAssetId,
                  selectedAccount.assetId,
                ).abbr
              : ''
          }
        />
      </Flex>
    </Flex>
  );
};

const OfferBox: React.FC<any> = ({
  selectedIndex,
  setSelectedIndex,
  offerData,
}) => {
  return (
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
        {offerData.isBest && <Tag type="gold">Best Offer</Tag>}
      </Flex>
      <Flex direction="column">
        {offerData?.data?.map((data: any) => {
          return (
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
          );
        })}
      </Flex>
    </Flex>
  );
};

export const SwapQuotesHeader: React.FC<{
  size: number;
  onTimeEnd: () => void;
}> = ({ size, onTimeEnd }) => {
  const [seconds, setSeconds] = useState(30);

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
      <span>{size} quotes found</span>
      <span>Updates in {remainingTime}</span>
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
}> = ({
  quotes,
  setSelectedOfferIndex,
  selectedOfferIndex,
  toAccount,
  fromAccount,
  findNewQuotes,
}) => {
  const { toNextPage, fillDetails } = useSwap();

  return (
    <>
      <SwapQuotesHeader size={quotes.length} onTimeEnd={findNewQuotes} />
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
                  title: 'Fixed Rate',
                  value: [`1 ${fromUnit} =`, `${rate} ${toUnit}`],
                },
              ],
              isBest: index === 0,
              provider: quote.provider,
            }}
            setSelectedIndex={setSelectedOfferIndex}
            selectedIndex={selectedOfferIndex}
            key={quote.id}
          />
        );
      })}
      {quotes.length === 0 && 'No quotes found'}
      <Button
        variant="primary"
        disabled={
          selectedOfferIndex === undefined ||
          selectedOfferIndex >= quotes.length
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
          console.log({ quote });
          fillDetails({
            from: fromAccount,
            to: toAccount,
            quote,
          });
          toNextPage();
        }}
        display="inline-block"
      >
        <LangDisplay text={'Continue'} />
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
  });

  const [fromAmount, setFromAmount] = useState('');

  const toWallet = useWalletDropdown();
  const toAccount = useAccountDropdown({
    selectedWallet: toWallet.selectedWallet,
  });

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

  const fetchQuotes = async (
    from: IAccount,
    to: IAccount,
    amount: string,
    isValid: boolean,
  ) => {
    let newQuotes: IQuote[] = [];
    let newRange = undefined;
    if (
      !(
        isValid &&
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
        amount: amount,
      });

      if (result.status === 200) {
        newQuotes = result.data.data;
        newRange = result.data?.metadata?.range;
      }
    } catch (e) {
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
      setFromAmount('');
    }
  }, [fromWallet.selectedWallet, fromAccount.selectedAccount]);

  const findNewQuotes = () => {
    setIsFetchingQuotes(true);
    debouncedGetQuotes(
      fromAccount.selectedAccount!,
      toAccount.selectedAccount!,
      fromAmount,
      hasEnoughBalance,
    );
  };

  useEffect(findNewQuotes, [
    fromAccount.selectedAccount,
    fromAmount,
    toAccount.selectedAccount,
  ]);

  return (
    <Container
      m={{ def: 2, lg: '20' }}
      $borderRadius={24}
      shadow="popup"
      direction={{ def: 'column', lg: 'row' }}
      align="stretch"
      $borderWidth={0}
      $overflow="hidden"
      height="full"
    >
      <Flex gap={16} p={5} px={4} height="fit-content">
        <AmountAndAccountSelection
          selectionLabel="From"
          amountLabel="Amount to send"
          handleWalletChange={fromWallet.handleWalletChange}
          walletDropdownList={fromWallet.walletDropdownList}
          selectedWallet={fromWallet.selectedWallet}
          selectedAccount={fromAccount.selectedAccount}
          handleAccountChange={fromAccount.handleAccountChange}
          accountDropdownList={fromAccount.accountDropdownList}
          amount={fromAmount}
          setAmount={setFromAmount}
          amountError={!hasEnoughBalance ? 'Not enough balance' : undefined}
        />
        <div style={{ alignSelf: 'center' }}>
          <Button
            variant="icon"
            onClick={() => {
              console.log('someday maybe');
            }}
            disabled={true}
          >
            <GraphSwitchIcon />
          </Button>
        </div>
        <AmountAndAccountSelection
          selectionLabel="To"
          amountLabel="You will receive"
          handleWalletChange={toWallet.handleWalletChange}
          walletDropdownList={toWallet.walletDropdownList}
          selectedWallet={toWallet.selectedWallet}
          selectedAccount={toAccount.selectedAccount}
          handleAccountChange={toAccount.handleAccountChange}
          accountDropdownList={toAccount.accountDropdownList}
          amount={calculatedAmount}
          isAmountDisabled={true}
        />
      </Flex>
      <Flex
        $bgColor="list"
        grow={1}
        gap={24}
        p={5}
        px={4}
        direction="column"
        $overflow="auto"
      >
        {isFetchingQuotes ? (
          <Flex mt={4} justify="center" gap={16} align="center">
            {throbber}
            <Typography
              color="muted"
              justify="space-between"
              display="flex"
              $allowOverflow
            >
              Searching for your best offer
            </Typography>
          </Flex>
        ) : quotes.length > 0 ? (
          <SwapQuotes
            quotes={quotes}
            setSelectedOfferIndex={setSelectedOfferIndex}
            selectedOfferIndex={selectedOfferIndex}
            toAccount={toAccount.selectedAccount}
            fromAccount={fromAccount.selectedAccount}
            findNewQuotes={findNewQuotes}
          />
        ) : (
          <Flex mt={4} justify="center" direction="column" align="center">
            <Typography
              color="muted"
              justify="space-between"
              display="flex"
              $allowOverflow
            >
              No offers available for your request
            </Typography>
            <Typography
              color="muted"
              justify="space-between"
              display="flex"
              $allowOverflow
            >
              {range
                ? `Amount should be between ${range.min} and ${range.max}`
                : 'Currency not supported'}
            </Typography>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};
