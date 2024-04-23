import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import {
  convertToUnit,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
  formatDisplayPrice,
} from '@cypherock/coin-support-utils';
import { Divider, Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { selectLanguage, selectPriceInfos, useAppSelector } from '~/store';

import { FeesHeaderProps } from './FeesHeader';
import { FeesTitle } from './FeesTitle';
import { ValueDisplay } from './ValueDisplay';

export const OptimismFeesHeader: React.FC<FeesHeaderProps> = ({
  initialState,
  onChange,
  title,
}) => {
  const { transaction, selectedAccount } = useSendDialog();
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const lang = useAppSelector(selectLanguage);

  const getTotalFees = () => {
    const account = selectedAccount;
    if (!account || !transaction) return `0`;
    const txn = transaction as IPreparedEvmTransaction;
    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      unitAbbr: getDefaultUnit(account.parentAssetId).abbr,
      amount: txn.computedData.l1Fee,
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
      const txn = transaction as IPreparedEvmTransaction;
      const feesInDefaultUnit = convertToUnit({
        amount: txn.computedData.l1Fee,
        fromUnitAbbr: getZeroUnit(account.parentAssetId).abbr,
        coinId: account.parentAssetId,
        toUnitAbbr: getDefaultUnit(account.parentAssetId).abbr,
      });
      const value = new BigNumber(feesInDefaultUnit.amount).multipliedBy(
        coinPrice.latestPrice,
      );
      return `$${formatDisplayPrice(value)}`;
    }
    return '';
  };
  return (
    <>
      <Divider variant="horizontal" />

      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" $fontSize={14}>
            <LangDisplay text={title + lang.strings.send.optimism.l1} />
          </Typography>
        </Flex>
        <ValueDisplay
          fee={getTotalFees()}
          isLoading={false}
          value={getFeesValue()}
        />
      </Flex>

      <Divider variant="horizontal" />

      <FeesTitle
        initialState={initialState}
        onChange={onChange}
        title={title + lang.strings.send.optimism.l2}
      />
    </>
  );
};
