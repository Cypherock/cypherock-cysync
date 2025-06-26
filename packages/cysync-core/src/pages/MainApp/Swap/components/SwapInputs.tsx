import {
  getDefaultUnit,
  formatDisplayPrice,
} from '@cypherock/coin-support-utils';
import {
  CustomInputSend,
  Dropdown,
  Flex,
  Input,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useMemo, useRef } from 'react';

import { useAppSelector, selectLanguage, selectPriceInfos } from '~/store';

const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;

const AmountInput: React.FC<any> = ({
  placeholder,
  amount,
  isDisabled,
  isLoading,
  coinValue,
  coinUnit,
  setAmount,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const adjustInputCursor = () => {
    if (
      inputRef.current?.selectionEnd &&
      inputRef.current.selectionEnd > amount.toString().length
    ) {
      if (amount === '0') {
        inputRef.current.setSelectionRange(0, amount.length);
      } else {
        inputRef.current.setSelectionRange(amount.length, amount.length);
      }
    }
  };

  const handleCoinAmountChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setAmount(filteredValue);
  };

  return (
    <>
      <CustomInputSend error={error}>
        <Input
          ref={inputRef}
          type="text"
          name="amount"
          placeholder={placeholder}
          onChange={handleCoinAmountChange}
          value={`${amount} ${coinUnit}`}
          onClick={adjustInputCursor}
          onKeyDown={e => e.code === 'Backspace' && adjustInputCursor()}
          disabled={isDisabled}
          $textColor="white"
          $noBorder
        />
        {isLoading ? (
          throbber
        ) : (
          <Typography
            $fontSize={16}
            color="muted"
            $textOverflow="ellipsis"
            $whiteSpace="nowrap"
            width="50%"
            $maxWidth="50%"
            $textAlign="right"
          >
            {coinValue}
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

export const AmountAndAccountSelection: React.FC<any> = ({
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
  autoFocus,
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

    return `~${value} ${assetPrice.currency.toUpperCase()}`;
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
          autoFocus={autoFocus}
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
        </Flex>
        <AmountInput
          placeholder="0"
          amount={amount}
          setAmount={setAmount}
          isDisabled={!selectedAccount || isAmountDisabled}
          error={amountError}
          coinValue={coinValue}
          coinUnit={coinUnit}
        />
      </Flex>
    </Flex>
  );
};
