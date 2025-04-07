import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import {
  BinanceConnet,
  cysyncLogoSmall,
  DashedLineEndCircled,
  DialogBox,
  DialogBoxBody,
  Container,
  LangDisplay,
  DialogBoxFooter,
  Button,
  Flex,
  Image,
  Dropdown,
  DropDownItemProps,
  Input,
  InputLabel,
  Typography,
  addKeyboardEvents,
  Divider,
  GraphSwitchIcon,
  CustomInputSend,
  Throbber,
  Tag,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { sleep } from '@cypherock/sdk-utils';
import lodash, { lt } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { openReceiveDialog, openSendDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
import { getQuotes } from '~/services/swapService';

import {
  useAppSelector,
  selectLanguage,
  useAppDispatch,
  selectUnHiddenAccounts,
  selectPriceInfos,
} from '~/store';

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

export interface IProviderDetails {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IQuote {
  id: string;
  provider: IProviderDetails;
  validUntil: number;
  fee: string;
  fromAmount: string;
  toAmount: string;
}

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
            $width={50}
            $height={50}
          />
          <Typography $fontSize={14}>{offerData.provider.name}</Typography>
        </Flex>
        {offerData.isBest && <Tag type="gold">Best Offer</Tag>}
      </Flex>
      <Flex direction="column">
        {offerData?.data?.map((data: any) => {
          return (
            <Flex justify="space-between" align="center">
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

export const SwapDetailsInput = () => {
  const { accounts } = useAppSelector(selectUnHiddenAccounts);
  const { accountDropdownList } = useAccountDropdown({
    selectedWallet: undefined,
  });
  const [selectedFromAccount, setSelectedFromAccount] =
    useState<DropDownItemProps>();
  const [selectedToAccount, setSelectedToAccount] =
    useState<DropDownItemProps>();
  const [inputAmount, setInputAmount] = useState(0);
  const outputAmount = useMemo(() => inputAmount * 0.89, [inputAmount]);
  const providerAmount = useMemo(
    () => Math.floor(inputAmount) % 5,
    [inputAmount],
  );

  const [isLoading, setIsLoading] = useState(false);
  const timeoutId = useRef<any>();

  const [selectedOfferIndex, setSelectedOfferIndex] = useState(undefined);
  const offers = [];

  const dispatch = useAppDispatch();
  const [isFlowOver, setIsFlowOver] = useState(false);

  const openSend = useCallback(() => {
    const obj = {
      walletId:
        'aa8d9298a7fa34993d8ca650cb80048ebe86f1b47dd8a5bb89a03dc9c37c674e',
      accountId: 'ad844c98-5fa5-4469-ad39-46d57928989e',
    };
    dispatch(openSendDialog({ ...obj, skipAccountSelection: true }));
  }, [dispatch, selectedFromAccount, accounts]);

  addKeyboardEvents({
    x: openSend,
  });

  const fromWallet = useWalletDropdown();
  const fromAccount = useAccountDropdown({
    selectedWallet: fromWallet.selectedWallet,
  });

  const [fromAmount, setFromAmount] = useState('');

  const toWallet = useWalletDropdown();
  const toAccount = useAccountDropdown({
    selectedWallet: toWallet.selectedWallet,
  });

  if (isFlowOver) return <LoaderDialog />;

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
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);

  const fetchQuotes = async (from: IAccount, to: IAccount, amount: string) => {
    await sleep(2000);

    const result = await getQuotes({
      fromCurrency: from.assetId,
      fromNetwork: from.parentAssetId,
      toCurrency: to.assetId,
      toNetwork: to.parentAssetId,
      amount: amount,
    });

    let quotes = [];
    if (result.status === 200) {
      quotes = result.data.data;
    }

    setQuotes(quotes);
    setIsFetchingQuotes(false);
  };

  const debouncedGetQuotes = useCallback(
    lodash.debounce(fetchQuotes, 1000),
    [],
  );

  useEffect(() => {
    if (
      fromWallet.selectedWallet === undefined ||
      fromAccount.selectedAccount === undefined
    ) {
      setFromAmount('');
    }
  }, [fromWallet.selectedWallet, fromAccount.selectedAccount]);

  useEffect(() => {
    if (
      hasEnoughBalance &&
      fromAccount.selectedAccount !== undefined &&
      !new BigNumber(fromAmount).isNaN() &&
      toAccount.selectedAccount !== undefined
    ) {
      console.log('isFetchingQuotes');
      setIsFetchingQuotes(true);
      debouncedGetQuotes(
        fromAccount.selectedAccount,
        toAccount.selectedAccount,
        fromAmount,
      );
    } else {
      setQuotes([]);
    }
  }, [fromAccount.selectedAccount, fromAmount, toAccount.selectedAccount]);

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
          <Typography
            color="muted"
            justify="space-between"
            display="flex"
            $allowOverflow
          >
            Fetching
          </Typography>
        ) : (
          <>
            <Typography
              color="muted"
              justify="space-between"
              display="flex"
              $allowOverflow
            >
              <span>{quotes.length} quotes found</span>
              <span>Updates in</span>
            </Typography>
            {quotes.map((quote, index) => {
              const fromUnit = fromAccount.selectedAccount?.unit ?? '';
              const toUnit = toAccount.selectedAccount?.unit ?? '';

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
              onClick={() => {}}
              display="inline-block"
            >
              <LangDisplay text={'Continue'} />
            </Button>
          </>
        )}
      </Flex>
    </Container>
  );
};
