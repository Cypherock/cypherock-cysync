import {
  getDefaultUnit,
  getParsedAmount,
  formatDisplayPrice,
} from '@cypherock/coin-support-utils';
import { CoinFamily, evmCoinList } from '@cypherock/coins';
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
import { useLabelSuffix } from '../hooks';

export const SummaryDialog: React.FC = () => {
  const {
    onNext,
    onPrevious,
    selectedAccount,
    selectedAccountParent,
    selectedWallet,
    transaction,
    getComputedFee,
  } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const button = lang.strings.buttons;
  const displayText = lang.strings.send.summary;
  const getLabelSuffix = useLabelSuffix();

  const getToDetails = () => {
    const account = selectedAccount;
    const coinPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];
    const details = transaction?.userInputs.outputs.flatMap(output => {
      const { amount, unit } = getParsedAmount({
        coinId: account.parentAssetId,
        assetId: account.assetId,
        amount: output.amount,
        unitAbbr:
          account.unit ??
          getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      });
      const value = formatDisplayPrice(
        new BigNumber(amount).multipliedBy(coinPrice.latestPrice),
      );

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
    const assetPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    const parentAssetPrice = priceInfos.find(
      p =>
        p.assetId === account?.parentAssetId &&
        p.currency.toLowerCase() === 'usd',
    );
    if (!account || !assetPrice || !parentAssetPrice) return [];
    let totalAmount = new BigNumber(0);

    transaction?.userInputs.outputs.forEach(output => {
      totalAmount = totalAmount.plus(output.amount);
    });

    const { amount } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      amount: totalAmount.toString(),
      unitAbbr:
        account.unit ??
        getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    });
    const amountValue = new BigNumber(amount).multipliedBy(
      assetPrice.latestPrice,
    );

    const totalFee = new BigNumber(
      getComputedFee(account.familyId as CoinFamily, transaction),
    );

    const { amount: feeAmount } = getParsedAmount({
      coinId: account.parentAssetId,
      amount: totalFee.toString(),
      unitAbbr: getDefaultUnit(account.parentAssetId).abbr,
    });
    const feeValue = new BigNumber(feeAmount).multipliedBy(
      parentAssetPrice.latestPrice,
    );

    const totalValue = formatDisplayPrice(amountValue.plus(feeValue));

    return [
      {
        id: 'total-amount-details',
        leftText: displayText.debit,
        rightText: `$${totalValue}`,
      },
    ];
  };

  const getFeeDetails = () => {
    const details = [];
    const account = selectedAccount;
    const coinPrice = priceInfos.find(
      p =>
        p.assetId === account?.parentAssetId &&
        p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];
    const { amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      amount: getComputedFee(account.familyId as CoinFamily, transaction),
      unitAbbr: getDefaultUnit(account.parentAssetId).abbr,
    });

    const value = formatDisplayPrice(
      new BigNumber(amount).multipliedBy(coinPrice.latestPrice),
    );

    details.push({
      id: 'fee-details',
      leftText: displayText.network + getLabelSuffix(selectedAccount),
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
        name: selectedAccountParent?.name ?? selectedAccount?.name ?? '',
        muted: false,
        icon: <CoinIcon parentAssetId={selectedAccount?.parentAssetId ?? ''} />,
      },
    ];
    if (selectedAccount?.type === AccountTypeMap.subAccount) {
      fromDetails.push({
        id: 'asset',
        // TODO: make this not depend on evmCoinList
        name: evmCoinList[selectedAccount.parentAssetId].tokens[
          selectedAccount.assetId
        ].name,
        muted: false,
        icon: (
          <CoinIcon
            parentAssetId={selectedAccount.parentAssetId}
            assetId={selectedAccount.assetId}
          />
        ),
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
