import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
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
import { EthereumInput } from './EthereumInput';
import { FeesDisplay } from './FeesDisplay';
import { FeesHeader } from './FeesHeader';

import { useSendDialog } from '../../../context';

const feeInputMap: Record<CoinFamily, React.FC<any>> = {
  bitcoin: BitcoinInput,
  evm: EthereumInput,
  near: BitcoinInput,
  solana: BitcoinInput,
};

export const FeeSection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const { transaction, selectedAccount, prepare } = useSendDialog();
  const [isFeeLow, setIsFeeLow] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isFeeLoading, setIsFeeLoading] = useState(false);

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

  const getEthereumProps = () => {
    const { feesUnit } = coinList[selectedAccount?.assetId ?? ''];
    const txn = transaction as IPreparedEvmTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: selectedAccount?.parentAssetId ?? '',
      amount: txn.staticData.averageGasPrice,
      unitAbbr: feesUnit || 'Gwei',
    });
    const inputGasPrice = getParsedAmount({
      coinId: selectedAccount?.parentAssetId ?? '',
      amount: txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice,
      unitAbbr: feesUnit || 'Gwei',
    }).amount;
    return {
      isTextInput,
      unit: unit.abbr,
      initialGasPrice: amount,
      inputGasPrice,
      onChange: debouncedEvmPrepareFeeChanged,
    };
  };

  const feeInputPropsMap: Record<CoinFamily, () => Record<string, any>> = {
    bitcoin: getBitcoinProps,
    evm: getEthereumProps,
    near: () => ({}),
    solana: () => ({}),
  };

  const getFeeInputComponent = (coinFamily: CoinFamily) => {
    const Component = feeInputMap[coinFamily];
    const props = feeInputPropsMap[coinFamily]();
    return <Component {...props} />;
  };

  const prepareFeeChanged = async (value: number) => {
    setIsFeeLoading(true);
    const txn = transaction as IPreparedBtcTransaction;
    setIsFeeLow(value < (2 / 3) * txn.staticData.averageFee);
    txn.userInputs.feeRate = value;
    await prepare(txn);
    setIsFeeLoading(false);
  };

  const debouncedPrepareFeeChanged = useCallback(
    lodash.debounce(prepareFeeChanged, 300),
    [],
  );

  const evmPrepareFee = async (param: {
    gasLimit?: number;
    gasPrice?: number;
  }) => {
    setIsFeeLoading(true);
    const txn = transaction as IPreparedEvmTransaction;
    const gasPrice = param.gasPrice
      ? convertToUnit({
          amount: param.gasPrice,
          coinId: selectedAccount?.parentAssetId ?? '',
          fromUnitAbbr: `Gwei`,
          toUnitAbbr: getZeroUnit(selectedAccount?.parentAssetId ?? '').abbr,
        }).amount
      : txn.userInputs.gasPrice;
    const gasLimit = param.gasLimit ?? Number(txn.computedData.gasLimit);

    // the gas price check for 2/3 of the average is same as bitcoin
    setIsFeeLow(
      Number(gasPrice) < (2 / 3) * Number(txn.staticData.averageGasPrice) ||
        gasLimit < Number(txn.computedData.gasLimit),
    );

    if (param.gasLimit) {
      // user modified gas limit
      txn.userInputs.gasLimit = gasLimit.toString(10);
    }
    if (param.gasPrice) {
      // user modified gas price
      txn.userInputs.gasPrice = gasPrice;
    }
    await prepare(txn);
    setIsFeeLoading(false);
  };

  const debouncedEvmPrepareFeeChanged = useCallback(
    lodash.debounce(evmPrepareFee, 300),
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
        isLoading={isFeeLoading}
        image={
          <CoinIcon parentAssetId={selectedAccount?.parentAssetId ?? ''} />
        }
      />
      {isFeeLow && <MessageBox type="warning" text={displayText.warning} />}
    </Container>
  );
};
