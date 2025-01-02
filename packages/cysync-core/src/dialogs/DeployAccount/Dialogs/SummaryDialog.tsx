import {
  getDefaultUnit,
  getParsedAmount,
  formatDisplayPrice,
  getAsset,
} from '@cypherock/coin-support-utils';
import { CoinFamily } from '@cypherock/coins';
import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  DialogBoxBody,
  Typography,
  walletIcon,
  Button,
  Image,
  SummaryBox,
  ScrollableContainer,
  MessageBox,
  Container,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

import { CoinIcon, LoaderDialog } from '~/components';
import { selectLanguage, selectPriceInfos, useAppSelector } from '~/store';

import { useDeployAccountDialog } from '../context';

export const SummaryDialog: React.FC = () => {
  const {
    onNext,
    onSummaryDialogPrevious,
    selectedAccount,
    selectedAccountParent,
    selectedWallet,
    transaction,
    getComputedFee,
    prepare,
  } = useDeployAccountDialog();
  const lang = useAppSelector(selectLanguage);
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const button = lang.strings.buttons;
  const displayText = lang.strings.deployAccount.summary;

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
      leftText: displayText.fee,
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
      const token = getAsset(
        selectedAccount.parentAssetId,
        selectedAccount.assetId,
      );

      fromDetails.push({
        id: 'asset',
        name: token.name,
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

  const getAccountDetails = () => {
    if (!selectedAccount) return [];
    const address = selectedAccount.xpubOrAddress;

    return [
      {
        id: `account-${address}`,
        leftText: displayText.account,
        rightText: address,
      },
    ];
  };

  useEffect(() => {
    prepare();
  }, []);

  const [hasError, setHasError] = useState(false);
  const continueBtnState = !hasError;
  useEffect(() => {
    setHasError(!transaction || !transaction.validation.hasEnoughBalance);
  }, [transaction]);

  if (transaction === undefined) return <LoaderDialog />;

  return (
    <DialogBox width={600}>
      <DialogBoxBody p={0} pt={5}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={displayText.title} />
        </Typography>

        <ScrollableContainer $maxHeight={{ def: '40vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5} gap={24}>
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
                ...getAccountDetails(),
                { isDivider: true, id: '2' },
                ...getFeeDetails(),
              ]}
            />
          </DialogBoxBody>
        </ScrollableContainer>
        <Container display="flex" direction="column" px={4} gap={16}>
          <MessageBox type="warning" text={displayText.messageBox.warning} />
          {hasError && (
            <MessageBox type="danger" text={displayText.messageBox.error} />
          )}
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary" onClick={onSummaryDialogPrevious}>
          <LangDisplay text={button.back} />
        </Button>
        <Button
          variant="primary"
          disabled={!continueBtnState}
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
