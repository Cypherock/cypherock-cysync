import {
  formatDisplayAmount,
  formatDisplayPrice,
  getAsset,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  ScrollableContainer,
  SummaryBox,
  Typography,
  Image,
  walletIcon,
  SummaryItemType,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import React from 'react';

import { CoinIcon } from '~/components';
import { useSwap } from '~/context';
import {
  selectAccounts,
  selectLanguage,
  selectPriceInfos,
  selectWallets,
  useAppSelector,
} from '~/store';

export const SwapSummary = () => {
  const { wallets } = useAppSelector(selectWallets);
  const { accounts } = useAppSelector(selectAccounts);
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const lang = useAppSelector(selectLanguage);

  const button = lang.strings.buttons;
  const displayText = lang.strings.swap.swapSummary;

  const { fromAccount, quote, toAccount, toNextPage } = useSwap();

  const getAccountDetails = (account: IAccount) => {
    const accountDetails = [
      {
        id: 'wallet',
        name: wallets.find(w => w.__id === account.walletId)?.name ?? '',
        muted: true,
      },
      {
        id: 'account',
        name:
          accounts.find(a => a.__id === account.parentAccountId)?.name ??
          account.name ??
          '',
        muted: false,
        icon: <CoinIcon parentAssetId={account.parentAssetId ?? ''} />,
      },
    ];
    if (account.type === AccountTypeMap.subAccount) {
      const token = getAsset(account.parentAssetId, account.assetId);

      accountDetails.push({
        id: 'asset',
        name: token.name,
        muted: false,
        icon: (
          <CoinIcon
            parentAssetId={account.parentAssetId}
            assetId={account.assetId}
          />
        ),
      });
    }
    return accountDetails;
  };

  const getAmountDetails = () => {
    const account = fromAccount;
    const coinPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];

    const amount = quote?.fromAmount ?? '0';
    const unit = getDefaultUnit(account.parentAssetId, account.assetId).abbr;

    const value = formatDisplayPrice(
      new BigNumber(amount).multipliedBy(coinPrice.latestPrice),
    );

    const outputDetails: SummaryItemType = [
      {
        id: `toDetail-amount`,
        leftText: displayText.amount,
        rightText: `${amount} ${unit}`,
        rightSubText: `$${value}`,
      },
    ];

    return outputDetails;
  };

  const getFeeDetails = () => {
    const details = [];
    const account = fromAccount;
    const coinPrice = priceInfos.find(
      p =>
        p.assetId === account?.parentAssetId &&
        p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];

    const fee = quote?.fee ?? '0';
    const amount = formatDisplayAmount(
      new BigNumber(fee).dividedBy(coinPrice.latestPrice),
    ).fixed;
    const unit = getDefaultUnit(account.parentAssetId).abbr;

    const value = formatDisplayPrice(new BigNumber(fee));

    details.push({
      id: 'fee-details',
      leftText: displayText.networkFee,
      rightText: `${amount} ${unit}`,
      rightSubText: `$${value}`,
    });

    return details;
  };

  const getTotalAmount = () => {
    const account = fromAccount;
    const assetPrice = priceInfos.find(
      p => p.assetId === account?.assetId && p.currency.toLowerCase() === 'usd',
    );
    const parentAssetPrice = priceInfos.find(
      p =>
        p.assetId === account?.parentAssetId &&
        p.currency.toLowerCase() === 'usd',
    );
    const coinPrice = priceInfos.find(
      p =>
        p.assetId === account?.parentAssetId &&
        p.currency.toLowerCase() === 'usd',
    );
    if (!account || !assetPrice || !parentAssetPrice || !coinPrice) return [];

    const amount = quote?.fromAmount ?? '0';
    const amountValue = new BigNumber(amount).multipliedBy(
      assetPrice.latestPrice,
    );

    const feeAmount = quote?.fee ?? '0';
    const feeInCrypto = new BigNumber(feeAmount).dividedBy(
      coinPrice.latestPrice,
    );
    const unit = getDefaultUnit(account.parentAssetId, account.assetId).abbr;

    const totalValue = formatDisplayPrice(amountValue.plus(feeAmount));
    const totalAmount = formatDisplayAmount(
      new BigNumber(amount).plus(feeInCrypto),
    ).fixed;

    return [
      {
        id: 'total-amount-details',
        leftText: displayText.totalToDebit,
        rightText: `${totalAmount} ${unit}`,
        rightSubText: `$${totalValue}`,
      },
    ];
  };

  return (
    <Container width="full" height="full">
      <DialogBox width={600}>
        <DialogBoxBody p={0} pt={5}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={displayText.heading} />
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
                    rightComponent: getAccountDetails(fromAccount!),
                  },
                  { isDivider: true, id: '2' },
                  {
                    id: 'to',
                    leftText: displayText.to,
                    leftIcon: (
                      <Image
                        src={walletIcon}
                        alt="From"
                        $width="15px"
                        $height="12px"
                      />
                    ),
                    rightComponent: getAccountDetails(toAccount!),
                  },
                  ...getAmountDetails(),
                  {
                    id: 'provider',
                    leftText: displayText.provider,
                    rightComponent: [
                      {
                        id: 'providericon',
                        name: quote?.provider.name ?? '',
                        muted: false,
                        icon: (
                          <Image
                            src={quote?.provider.imageUrl ?? ''}
                            alt="Logo"
                            $width={25}
                            $height={25}
                          />
                        ),
                      },
                    ],
                  },
                  ...getFeeDetails(),
                  { isDivider: true, id: '6' },
                  ...getTotalAmount(),
                ]}
              />
            </DialogBoxBody>
          </ScrollableContainer>
        </DialogBoxBody>
        <DialogBoxFooter height={101}>
          <Button
            variant="primary"
            onClick={() => {
              toNextPage();
            }}
          >
            <LangDisplay text={button.continue} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </Container>
  );
};
