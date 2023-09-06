import { getParsedAmount } from '@cypherock/coin-support-utils';
import { Container } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressInput } from './AddressInput';
import { AmountInput } from './AmountInput';

import { useSendDialog } from '../../../context';

export const SingleTransaction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  const {
    selectedAccount,
    transaction,
    prepareAddressChanged,
    prepareAmountChanged,
    prepareSendMax,
    priceConverter,
    updateUserInputs,
  } = useSendDialog();

  useEffect(() => {
    updateUserInputs(1);
  }, []);

  const getInitialAmount = (val?: string) => {
    if (!val || !selectedAccount) return undefined;
    return getParsedAmount({
      coinId: selectedAccount.assetId,
      amount: val,
      unitAbbr: selectedAccount.unit,
    }).amount;
  };

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <Container display="flex" direction="column" gap={8} width="full">
        <AddressInput
          label={displayText.recipient.label}
          placeholder={displayText.recipient.placeholder}
          initialValue={transaction?.userInputs.outputs[0]?.address}
          error={
            transaction?.validation.outputs[0] === false
              ? displayText.recipient.error
              : ''
          }
          onChange={prepareAddressChanged}
        />
        <AmountInput
          label={displayText.amount.label}
          coinUnit={selectedAccount?.unit ?? ''}
          toggleLabel={displayText.amount.toggle}
          priceUnit={displayText.amount.dollar}
          error={
            transaction?.validation.hasEnoughBalance === false
              ? displayText.amount.error
              : ''
          }
          placeholder={displayText.amount.placeholder}
          initialValue={getInitialAmount(
            transaction?.userInputs.outputs[0]?.amount,
          )}
          onChange={prepareAmountChanged}
          onToggle={prepareSendMax}
          converter={priceConverter}
        />
      </Container>
    </Container>
  );
};
