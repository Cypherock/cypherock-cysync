import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IPreparedIcpTransaction } from '@cypherock/coin-support-icp';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IPreparedXrpTransaction } from '@cypherock/coin-support-xrp';
import { coinFamiliesMap, CoinFamily } from '@cypherock/coins';
import { Container, parseLangTemplate } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AddressInput } from './AddressInput';
import { AmountInput } from './AmountInput';
import { DestinationTagInput } from './DestinationTagInput';
import { MemoInput } from './MemoInput';
import { NotesInput } from './NotesInput';

import { useSendDialog } from '../../../context';

const MAX_UINT64 = new BigNumber('0xffffffffffffffff');

interface SingleTransactionProps {
  disableInputs?: boolean;
  providerName?: string;
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
    prepareTransactionRemarks,
    prepareSendMax,
    prepareDestinationTag,
    prepareMemo,
    priceConverter,
    updateUserInputs,
    prepare,
    getOutputError,
    getAmountError,
    getDestinationTagError,
    providerName,
  } = useSendDialog();

  let recipientDisplayText = displayText.recipient;
  if (selectedAccount?.familyId === coinFamiliesMap.icp) {
    const isIcpToken = selectedAccount.type === AccountTypeMap.subAccount;
    recipientDisplayText = isIcpToken
      ? displayText.icpPrincipalIdRecipient
      : displayText.icpAccountIdRecipient;
  }

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
    tron: () => '',
    xrp: () => '',
    starknet: () => '',
    icp: () => '',
  };

  const getXrpDestinationTagInputProps = () => {
    const txn = transaction as IPreparedXrpTransaction;
    return {
      label: displayText.destinationTag.label,
      placeholder: displayText.destinationTag.placeholder,
      initialValue: txn.userInputs.outputs[0]?.destinationTag,
      isDisabled: disableInputs,
      onChange: prepareDestinationTag,
      error: getDestinationTagError(),
    };
  };

  const destinationTagInputPropsMap: Record<
    CoinFamily,
    () => Record<string, any>
  > = {
    bitcoin: () => ({}),
    evm: () => ({}),
    near: () => ({}),
    solana: () => ({}),
    tron: () => ({}),
    xrp: getXrpDestinationTagInputProps,
    starknet: () => ({}),
    icp: () => ({}),
  };

  const destinationTagInputMap: Partial<Record<CoinFamily, React.FC<any>>> = {
    xrp: DestinationTagInput,
  };

  const getDestinationTagInputComponent = () => {
    if (!selectedAccount) return null;
    const coinFamily = selectedAccount.familyId as CoinFamily;

    const Component = destinationTagInputMap[coinFamily];
    if (!Component) return null;

    const props = destinationTagInputPropsMap[coinFamily]();
    return <Component {...props} />;
  };

  const getIcpMemoInputProps = () => {
    const txn = transaction as IPreparedIcpTransaction;
    return {
      label: displayText.memo.label,
      placeholder: displayText.memo.placeholder,
      initialValue: txn.userInputs.outputs[0]?.memo,
      onChange: prepareMemo,
      limit: MAX_UINT64,
    };
  };

  const memoInputPropsMap: Record<CoinFamily, () => Record<string, any>> = {
    bitcoin: () => ({}),
    evm: () => ({}),
    near: () => ({}),
    solana: () => ({}),
    tron: () => ({}),
    xrp: () => ({}),
    starknet: () => ({}),
    icp: getIcpMemoInputProps,
  };

  const memoInputMap: Partial<Record<CoinFamily, React.FC<any>>> = {
    icp: MemoInput,
  };

  const getMemoInputComponent = () => {
    if (!selectedAccount) return null;
    const coinFamily = selectedAccount.familyId as CoinFamily;

    const isIcpToken =
      coinFamily === coinFamiliesMap.icp &&
      selectedAccount.type === AccountTypeMap.subAccount;
    if (isIcpToken) return null;

    const Component = memoInputMap[coinFamily];
    if (!Component) return null;

    const props = memoInputPropsMap[coinFamily]();
    return <Component {...props} />;
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

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <Container display="flex" direction="column" gap={8} width="full">
        <AddressInput
          label={
            providerName
              ? parseLangTemplate(recipientDisplayText.labelSwap, {
                  provider: providerName,
                })
              : recipientDisplayText.label
          }
          placeholder={recipientDisplayText.placeholder}
          initialValue={transaction?.userInputs.outputs[0]?.address}
          error={getOutputError(0)}
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

        {getDestinationTagInputComponent()}
        {getMemoInputComponent()}

        <NotesInput
          label={displayText.remarks.label}
          placeholder={displayText.remarks.placeholder}
          initialValue={transaction?.userInputs.outputs[0]?.remarks ?? ''}
          onChange={prepareTransactionRemarks}
        />
      </Container>
    </Container>
  );
};

SingleTransaction.defaultProps = {
  disableInputs: undefined,
  providerName: undefined,
};
