import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { CoinFamily } from '@cypherock/coins';
import { Container } from '@cypherock/cysync-ui';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressInput } from './AddressInput';
import { AmountInput } from './AmountInput';

import { useSendDialog } from '../../../context';

interface SingleTransactionProps {
  disableInputs?: boolean;
}
export const SingleTransaction: React.FC<SingleTransactionProps> = ({
  disableInputs,
}) => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const [amountOverride, setAmountOverride] = useState('');

  const {
    selectedAccount,
    transaction,
    prepareAddressChanged,
    prepareAmountChanged,
    prepareSendMax,
    priceConverter,
    updateUserInputs,
    prepare,
  } = useSendDialog();

  useEffect(() => {
    updateUserInputs(1);
    if (!transaction) return;
    const txn = transaction;
    txn.userInputs.isSendAll = false;
    prepare(txn);
  }, []);

  const getBitcoinMaxSendAmount = (txn: IPreparedTransaction) => {
    const { computedData } = txn as IPreparedBtcTransaction;
    return computedData.outputs[0]?.value.toString() || '';
  };

  const getEvmMaxSendAmount = (txn: IPreparedTransaction) => {
    const { computedData, userInputs } = txn as IPreparedEvmTransaction;
    if (selectedAccount?.type === AccountTypeMap.subAccount)
      return userInputs.outputs[0]?.amount;
    return computedData.output.amount;
  };

  const computedAmountMap: Record<
    CoinFamily,
    (txn: IPreparedTransaction) => string
  > = {
    bitcoin: getBitcoinMaxSendAmount,
    evm: getEvmMaxSendAmount,
    near: () => '',
    solana: () => '',
    starknet: () => '',
  };

  useEffect(() => {
    if (transaction?.userInputs.isSendAll) {
      const value =
        computedAmountMap[selectedAccount?.familyId as CoinFamily](transaction);
      const convertedValue = getConvertedAmount(value);
      setAmountOverride(convertedValue ?? '');
    }
  }, [transaction]);

  const getConvertedAmount = (val?: string) => {
    if (!val || !selectedAccount) return undefined;
    return getParsedAmount({
      coinId: selectedAccount.parentAssetId,
      assetId: selectedAccount.assetId,
      amount: val,
      unitAbbr:
        selectedAccount.unit ??
        getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
          .abbr,
    }).amount;
  };

  const getAmountError = () => {
    if (
      (transaction?.validation as IPreparedBtcTransaction['validation'])
        .isNotOverDustThreshold
    ) {
      return displayText.amount.notOverDustThreshold;
    }

    if (transaction?.validation.hasEnoughBalance === false) {
      return displayText.amount.error;
    }

    return '';
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
          isDisabled={disableInputs}
        />
        <AmountInput
          label={displayText.amount.label}
          coinUnit={
            selectedAccount
              ? selectedAccount.unit ??
                getDefaultUnit(
                  selectedAccount.parentAssetId,
                  selectedAccount.assetId,
                ).abbr
              : ''
          }
          toggleLabel={disableInputs ? '' : displayText.amount.toggle}
          initialToggle={transaction?.userInputs.isSendAll !== false}
          priceUnit={displayText.amount.dollar}
          error={getAmountError()}
          placeholder={displayText.amount.placeholder}
          initialAmount={getConvertedAmount(
            transaction?.userInputs.outputs[0]?.amount,
          )}
          overrideAmount={amountOverride}
          onChange={prepareAmountChanged}
          onToggle={prepareSendMax}
          converter={priceConverter}
          isDisabled={disableInputs}
        />
      </Container>
    </Container>
  );
};

SingleTransaction.defaultProps = {
  disableInputs: undefined,
};
