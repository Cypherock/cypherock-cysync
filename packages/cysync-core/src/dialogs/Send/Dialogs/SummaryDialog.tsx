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

import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../context';

export const SummaryDialog: React.FC = () => {
  const { onNext, onPrevious, selectedAccount, selectedWallet, transaction } =
    useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const summary = lang.strings.send.summary.info.dialogBox;

  const getToDetails = () => {
    const account = selectedAccount;
    if (!account) return [];
    const details = transaction?.userInputs.outputs.flatMap(output => {
      const { amount, unit } = getParsedAmount({
        coinId: account.assetId,
        amount: output.amount,
        unitAbbr: account.unit,
      });
      return [
        {
          id: `toDetail-address-${output.address}`,
          leftIcon: <QrCode width="11px" height="20px" />,
          leftText: summary.to,
          rightText: output.address,
        },
        {
          id: `toDetail-amount-${output.address}`,
          leftText: summary.amount,
          rightText: amount,
          rightSubText: unit.abbr,
        },
      ];
    });
    return details ?? [];
  };

  const getTotalAmount = () => {
    const account = selectedAccount!;
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

    return [
      {
        id: 'total-amount-details',
        leftText: summary.debit.text,
        rightText: amount,
        rightSubText: unit.abbr,
      },
    ];
  };

  const getFeeDetails = () => {
    const details = [];
    const account = selectedAccount!;
    if (account.familyId === 'bitcoin') {
      const txn = transaction as IPreparedBtcTransaction;
      const { amount, unit } = getParsedAmount({
        coinId: account.assetId,
        amount: txn.computedData.fee,
        unitAbbr: account.unit,
      });
      details.push({
        id: 'fee-details',
        leftText: summary.network.text,
        rightText: amount,
        rightSubText: unit.abbr,
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
          <LangDisplay text={summary.title} />
        </Typography>

        <SummaryBox
          items={[
            {
              id: 'from',
              leftText: summary.from,
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
