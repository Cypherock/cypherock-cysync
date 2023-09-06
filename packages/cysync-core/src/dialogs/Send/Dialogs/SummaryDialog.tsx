import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
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
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React from 'react';

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

    if (account.familyId === 'bitcoin') {
      const txn = transaction as IPreparedBtcTransaction;
      totalToDeduct = totalToDeduct.plus(txn.computedData.fee);
    }

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
    if (account.familyId === 'bitcoin') {
      const txn = transaction as IPreparedBtcTransaction;
      const { amount, unit } = getParsedAmount({
        coinId: account.assetId,
        amount: txn.computedData.fee,
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
    }
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
      },
    ];
    if (selectedAccount?.parentAssetId) {
      fromDetails.push({
        id: 'asset',
        name: coinList[selectedAccount.assetId].name,
        muted: false,
      });
    }
    return fromDetails;
  };

  return (
    <DialogBox width={600}>
      <DialogBoxBody>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={displayText.title} />
        </Typography>

        <SummaryBox
          items={[
            {
              id: 'from',
              leftText: displayText.from,
              leftIcon: (
                <Image src={walletIcon} alt="From" width="15px" height="12px" />
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
