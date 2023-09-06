import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import {
  convertToUnit,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { CoinFamily, coinList } from '@cypherock/coins';
import { Container, Divider, MessageBox } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

import { CoinIcon } from '~/components';
import { selectLanguage, selectPriceInfos, useAppSelector } from '~/store';

import { BitcoinInput } from './BitcoinInput';
import { FeesDisplay } from './FeesDisplay';
import { FeesHeader } from './FeesHeader';

import { useSendDialog } from '../../../context';

const feeInputMap: Record<CoinFamily, React.FC<any>> = {
  bitcoin: BitcoinInput,
  evm: BitcoinInput,
  near: BitcoinInput,
  solana: BitcoinInput,
};

export const FeeSection: React.FC = () => {
  const { transaction, selectedAccount, prepare } = useSendDialog();
  const [isTextInput, setIsTextInput] = useState(false);
  const { priceInfos } = useAppSelector(selectPriceInfos);

  const getBitcoinProps = () => {
    const { feesUnit } = coinList[selectedAccount?.assetId ?? ''];
    const txn = transaction as IPreparedBtcTransaction;
    return {
      isTextInput,
      unit: feesUnit,
      initialValue: txn.staticData.averageFee,
      onChange: debouncedPrepareFeeChanged,
    };
  };
  const feeInputPropsMap: Record<CoinFamily, () => Record<string, any>> = {
    bitcoin: getBitcoinProps,
    evm: () => ({}),
    near: () => ({}),
    solana: () => ({}),
  };

  const getFeeInputComponent = (coinFamily: CoinFamily) => {
    const Component = feeInputMap[coinFamily];
    const props = feeInputPropsMap[coinFamily]();
    return <Component {...props} />;
  };

  const prepareFeeChanged = async (value: number) => {
    const txn = transaction as IPreparedBtcTransaction;
    txn.userInputs.feeRate = value;
    await prepare(txn);
  };

  const debouncedPrepareFeeChanged = useCallback(
    lodash.debounce(prepareFeeChanged, 300),
    [],
  );

  const getTotalFees = () => {
    const account = selectedAccount;
    if (!account || !transaction) return `0`;
    const txn = transaction as IPreparedBtcTransaction;
    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.assetId,
      unitAbbr: account.unit,
      amount: txn.computedData.fee,
    });
    return `${_amount} ${unit.abbr}`;
  };
  const getFeesValue = () => {
    const account = selectedAccount;
    if (!account) return `0`;
    const coinPrice = priceInfos.find(
      p => p.assetId === account.assetId && p.currency.toLowerCase() === 'usd',
    );

    if (coinPrice && transaction) {
      const txn = transaction as IPreparedBtcTransaction;
      const feesInDefaultUnit = convertToUnit({
        amount: txn.computedData.fee,
        fromUnitAbbr: getZeroUnit(account.assetId).abbr,
        coinId: account.assetId,
        toUnitAbbr: getDefaultUnit(account.assetId).abbr,
      });
      const value = new BigNumber(feesInDefaultUnit.amount)
        .multipliedBy(coinPrice.latestPrice)
        .toFixed(2)
        .toString();
      return `$${value}`;
    }
    return '';
  };
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  return (
    <Container
      display="flex"
      direction="column"
      gap={16}
      px={5}
      pb={4}
      width="full"
    >
      <Divider variant="horizontal" />

      <FeesHeader
        initialState={isTextInput}
        onChange={setIsTextInput}
        title={displayText.fees.title}
      />

      {getFeeInputComponent(selectedAccount?.familyId as any)}

      <FeesDisplay
        label={displayText.fees.label}
        fee={getTotalFees()}
        value={getFeesValue()}
        image={<CoinIcon assetId={selectedAccount?.assetId ?? ''} />}
      />
      <MessageBox type="warning" text={displayText.warning} />
    </Container>
  );
};
