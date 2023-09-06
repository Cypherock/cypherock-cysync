import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { convertToUnit, getZeroUnit } from '@cypherock/coin-support-utils';
import { Container, RecipientAddress } from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

import { useRecipientAddress } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { AmountToSend } from './AmountToSend';

import { useSendDialog } from '../../../context';

export const SingleTransaction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  const { selectedAccount, transaction, prepare } = useSendDialog();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const onChangeDebounced = async (val: string) => {
    const txn = transaction as IPreparedBtcTransaction;
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].address = val;
    else
      txn.userInputs.outputs = [
        {
          address: val,
          amount: '',
        },
      ];
    await prepare(txn);
  };

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const { inputValue, isThrobberActive, handleInputValueChange } =
    useRecipientAddress(
      recipientAddress,
      handleRecipientAddressChange,
      onChangeDebounced,
    );

  const prepareAmountChanged = async (value: string) => {
    if (!selectedAccount) return;
    const txn = transaction as IPreparedBtcTransaction;
    const convertedAmount = convertToUnit({
      amount: value,
      coinId: selectedAccount.assetId,
      fromUnitAbbr: selectedAccount.unit,
      toUnitAbbr: getZeroUnit(selectedAccount.assetId).abbr,
    });
    console.log({ convertedAmount });
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].amount = convertedAmount.amount;
    else
      txn.userInputs.outputs = [
        {
          address: '',
          amount: convertedAmount.amount,
        },
      ];
    prepare(txn);
  };

  const debouncedPrepareAmountChanged = useCallback(
    lodash.debounce(prepareAmountChanged, 300),
    [],
  );

  const handleAmountChange = (value: string) => {
    setAmount(value);
    debouncedPrepareAmountChanged(value);
  };

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <Container display="flex" direction="column" gap={8} width="full">
        <RecipientAddress
          text={displayText.recipient.label}
          placeholder={displayText.recipient.placeholder}
          error={
            transaction?.validation.outputs[0] !== false
              ? ''
              : 'Invalid Address'
          }
          value={inputValue}
          onChange={handleInputValueChange}
          isThrobberActive={isThrobberActive}
        />
        <AmountToSend
          text={displayText.amount.label}
          coin={selectedAccount?.unit}
          toggle={displayText.amount.toggle}
          dollar={displayText.amount.dollar}
          error={
            transaction?.validation.hasEnoughBalance !== false
              ? ''
              : 'Insufficient Balance'
          }
          placeholder={displayText.amount.placeholder}
          value={amount}
          onChange={handleAmountChange}
        />
      </Container>
    </Container>
  );
};
