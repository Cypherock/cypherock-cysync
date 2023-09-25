import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { getParsedAmount } from '@cypherock/coin-support-utils';
import { CoinFamily, coinList } from '@cypherock/coins';
import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  walletIcon,
  Button,
  QrCode,
  Image,
  SummaryBox,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import React from 'react';

import { CoinIcon } from '~/components';
import { selectLanguage, selectPriceInfos, useAppSelector } from '~/store';

import { useSendDialog } from '../context';

export const SummaryDialog: React.FC = () => {
  const { onNext, onPrevious, selectedAccount, selectedWallet, transaction } =
    useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const button = lang.strings.buttons;
  const displayText = lang.strings.send.summary;

  const getToDetails = () => {
    const account = selectedAccount;
    const coinPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];
    const details = transaction?.userInputs.outputs.flatMap(output => {
      const { amount, unit } = getParsedAmount({
        coinId: account.assetId,
        amount: output.amount,
        unitAbbr: account.unit,
      });
      const value = new BigNumber(amount)
        .multipliedBy(coinPrice.latestPrice)
        .toPrecision(2)
        .toString();

      return [
        {
          id: `toDetail-address-${output.address}`,
          leftIcon: <QrCode width="11px" height="20px" />,
          leftText: displayText.to,
          rightText: output.address,
        },
        {
          id: `toDetail-amount-${output.address}`,
          leftText: displayText.amount,
          rightText: `${amount} ${unit.abbr}`,
          rightSubText: `$${value}`,
        },
      ];
    });
    if (details && details.length > 2) return [details];
    return details ?? [];
  };

  const bitcoinFeeAmount = (txn: IPreparedTransaction | undefined) => {
    // return '0' in error scenarios because BigNumber cannot handle empty string
    if (!txn) return '0';
    const { computedData } = txn as IPreparedBtcTransaction;
    return computedData.fee.toString() || '0';
  };

  const evmFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedEvmTransaction;
    return computedData.fee || '0';
  };

  const computedFeeMap: Record<
    CoinFamily,
    (txn: IPreparedTransaction | undefined) => string
  > = {
    bitcoin: bitcoinFeeAmount,
    evm: evmFeeAmount,
    near: () => '0',
    solana: () => '0',
  };

  const getTotalAmount = () => {
    const account = selectedAccount;
    const coinPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];
    let totalToDeduct = new BigNumber(0);

    transaction?.userInputs.outputs.forEach(output => {
      totalToDeduct = totalToDeduct.plus(output.amount);
    });
    totalToDeduct = totalToDeduct.plus(
      computedFeeMap[account.familyId as CoinFamily](transaction),
    );

    const { amount, unit } = getParsedAmount({
      coinId: account.assetId,
      amount: totalToDeduct.toString(),
      unitAbbr: account.unit,
    });
    const value = new BigNumber(amount)
      .multipliedBy(coinPrice.latestPrice)
      .toPrecision(2)
      .toString();

    return [
      {
        id: 'total-amount-details',
        leftText: displayText.debit,
        rightText: `${amount} ${unit.abbr}`,
        rightSubText: `$${value}`,
      },
    ];
  };

  const getFeeDetails = () => {
    const details = [];
    const account = selectedAccount;
    const coinPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];
    const { amount, unit } = getParsedAmount({
      coinId: account.assetId,
      amount: computedFeeMap[account.familyId as CoinFamily](transaction),
      unitAbbr: account.unit,
    });

    const value = new BigNumber(amount)
      .multipliedBy(coinPrice.latestPrice)
      .toPrecision(2)
      .toString();

    details.push({
      id: 'fee-details',
      leftText: displayText.network,
      rightText: `${amount} ${unit.abbr}`,
      rightSubText: `$${value}`,
    });

    return details;
  };

  const getFromDetails = () => {
    const fromDetails = [
      {
        id: 'wallet',
        name: selectedWallet?.name ?? '',
        muted: true,
      },
      {
        id: 'account',
        name: selectedAccount?.name ?? '',
        muted: false,
        icon: (
          <CoinIcon
            parentAssetId={
              selectedAccount?.parentAssetId ?? selectedAccount?.assetId ?? ''
            }
          />
        ),
      },
    ];
    if (selectedAccount?.type === AccountTypeMap.subAccount) {
      fromDetails.push({
        id: 'asset',
        name: coinList[selectedAccount.parentAssetId].name,
        muted: false,
        icon: <CoinIcon parentAssetId={selectedAccount.parentAssetId} />,
      });
    }
    return fromDetails;
  };

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={displayText.title} />
        </Typography>

        <ScrollableContainer $maxHeight={{ def: '40vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <SummaryBox
              items={[
                {
                  id: 'from',
                  leftText: displayText.from,
                  leftIcon: (
                    <Image
                      src={walletIcon}
                      alt="From"
                      $width="15px"
                      $height="12px"
                    />
                  ),
                  rightComponent: getFromDetails(),
                },
                { isDivider: true, id: '2' },
                ...getToDetails(),
                { isDivider: true, id: '3' },
                ...getFeeDetails(),
                { isDivider: true, id: '5' },
                ...getTotalAmount(),
              ]}
            />
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary" onClick={onPrevious}>
          <LangDisplay text={button.back} />
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onNext();
          }}
        >
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
