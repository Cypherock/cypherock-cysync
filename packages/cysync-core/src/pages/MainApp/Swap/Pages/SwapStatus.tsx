import {
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
  successIcon,
  warningIcon,
  GoldExternalLink,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

import { CoinIcon } from '~/components';
import { useSwap } from '~/context';
import { getExchangeStatus } from '~/services/swapService';
import {
  selectAccounts,
  selectLanguage,
  selectPriceInfos,
  selectWallets,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

enum SwapStates {
  Pending = 'pending',
  Failed = 'failed',
  Success = 'success',
}

export const SwapStatus = () => {
  const { strings } = useAppSelector(selectLanguage);
  const [state, setState] = useState(SwapStates.Pending);
  const displayText = {
    ...strings.swap.swapSummary,
    ...strings.swap.swapStatus,
  };
  const {
    fromAccount,
    quote,
    toAccount,
    reset,
    exchangeDetails,
    closeExchange,
  } = useSwap();
  const [providerUrl, setProviderUrl] = useState<string>();

  const updateState = async () => {
    if (state !== SwapStates.Pending) return;
    try {
      const result = await getExchangeStatus({
        providerId: quote?.provider.id ?? '',
        exchangeId: exchangeDetails?.id ?? '',
      });
      if (result.status === 200) {
        setProviderUrl(result?.data?.data?.providerUrl);

        if (result.data.data.status === 'finished')
          setState(SwapStates.Success);
        else if (result.data.data.status === 'failed')
          setState(SwapStates.Failed);
      }
    } catch (e) {
      logger.error(e);
    }
  };

  useEffect(() => {
    updateState();
    // update every minute
    const interval = setInterval(updateState, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const { wallets } = useAppSelector(selectWallets);
  const { accounts } = useAppSelector(selectAccounts);
  const { priceInfos } = useAppSelector(selectPriceInfos);

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

  const getAmountDetails = (
    text: string,
    account: IAccount,
    amount: string,
  ) => {
    const coinPrice = priceInfos.find(
      p => p.assetId === account.assetId && p.currency.toLowerCase() === 'usd',
    );
    if (!account || !coinPrice) return [];

    const unit = getDefaultUnit(account.parentAssetId, account.assetId).abbr;

    const value = formatDisplayPrice(
      new BigNumber(amount).multipliedBy(coinPrice.latestPrice),
    );

    const outputDetails: SummaryItemType = [
      {
        id: `${account.__id}-Detail-amount`,
        leftText: text,
        rightText: `${amount} ${unit}`,
        rightSubText: `$${value}`,
      },
    ];

    return outputDetails;
  };

  return (
    <Container width="full" height="full">
      <DialogBox width={600}>
        <DialogBoxBody p={0} pt={5}>
          <Image
            src={state === SwapStates.Success ? successIcon : warningIcon}
            alt="Status Icon"
          />
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={`${displayText.heading[state]}`} />
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
                  ...getAmountDetails(
                    displayText.amountSent,
                    fromAccount!,
                    quote?.fromAmount ?? '0',
                  ),
                  ...getAmountDetails(
                    displayText.amountReceived,
                    toAccount!,
                    quote?.toAmount ?? '0',
                  ),
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
                  ...(providerUrl
                    ? [
                        {
                          id: 'exchange-id',
                          leftText: displayText.transactionID,
                          rightComponent: [
                            {
                              id: 'exchange-link',
                              name: exchangeDetails?.id ?? '',
                              muted: false,
                              rightIcon: (
                                <a
                                  href={providerUrl}
                                  target="_blank"
                                  style={{ textDecoration: 'none' }}
                                  rel="noreferrer"
                                >
                                  <GoldExternalLink height={12} width={12} />
                                </a>
                              ),
                            },
                          ],
                        },
                      ]
                    : []),
                ]}
              />
            </DialogBoxBody>
          </ScrollableContainer>
        </DialogBoxBody>
        <DialogBoxFooter height={101}>
          <Button
            variant="primary"
            onClick={async () => {
              await closeExchange();
              reset();
            }}
          >
            <LangDisplay text={displayText.button.backToSwap} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </Container>
  );
};
