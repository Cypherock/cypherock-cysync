import {
  DEFAULT_CURRENCY,
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
  GoldExternalLink,
  MessageBox,
  SwapInformationIcon,
  parseLangTemplate,
  useTheme,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  SwapStatus as SwapStates,
  AccountTypeMap,
  IAccount,
  ISwapData,
} from '@cypherock/db-interfaces';
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

const SWAP_STATUS_UPDATE_DURATION = 1000 * 60;

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
    updateTransactionSwapData,
    transactionId,
    providerDetails,
  } = useSwap();
  const [providerUrl, setProviderUrl] = useState<string>();
  const [providerEmail, setProviderEmail] = useState<string>();
  const theme = useTheme();

  const updateState = async () => {
    if (state !== SwapStates.Pending) return;
    try {
      const result = await getExchangeStatus({
        providerId: quote?.provider.id ?? '',
        exchangeId: exchangeDetails?.id ?? '',
      });
      if (result.status === 200) {
        const url = result?.data?.data?.providerUrl;
        setProviderUrl(url);
        let swapData: ISwapData;

        if (
          transactionId.current &&
          fromAccount &&
          toAccount &&
          quote &&
          exchangeDetails
        ) {
          const fromUnit = getDefaultUnit(
            fromAccount.parentAssetId,
            fromAccount.assetId,
          ).abbr;
          const toUnit = getDefaultUnit(
            toAccount.parentAssetId,
            toAccount.assetId,
          ).abbr;

          swapData = {
            swapId: exchangeDetails.id,
            providerUrl: url,
            providerId: quote.provider.id,
            providerImageUrl: quote.provider.imageUrl,
            providerName: quote.provider.name,
            payoutTxnHash: result.data.data.payoutHash,
            swapStatus: SwapStates.Pending,
            isReceiveUpdated: false,
            sourceAccountId: fromAccount.__id ?? '',
            sourceWalletId: fromAccount.walletId,
            sourceAddress: fromAccount.xpubOrAddress,
            destinationWalletId: toAccount.walletId,
            destinationAccountId: toAccount.__id ?? '',
            destinationAssetId: toAccount.assetId,
            destinationParentAssetId: toAccount.parentAssetId,
            destinationAddress: toAccount.xpubOrAddress,
            sentAmount: quote.fromAmount,
            sentDisplayAmount: `${quote.fromAmount} ${fromUnit}`,
            receiveAmount: quote.toAmount,
            receiveDisplayAmount: `${quote.toAmount} ${toUnit}`,
          };

          if (result.data.data.status === 'finished') {
            setState(SwapStates.Success);
            swapData = {
              ...swapData,
              swapStatus: SwapStates.Success,
            };
          } else if (result.data.data.status === 'hold') {
            setState(SwapStates.Hold);
            const providerId = quote.provider.id;
            const providerSupportMail = providerDetails
              ? providerDetails[providerId].complianceEmail
              : '';
            setProviderEmail(providerSupportMail);
            swapData = {
              ...swapData,
              swapStatus: SwapStates.Hold,
            };
          } else if (result.data.data.status === 'expired') {
            setState(SwapStates.Expired);
            swapData = {
              ...swapData,
              swapStatus: SwapStates.Expired,
            };
          } else if (result.data.data.status === 'failed') {
            setState(SwapStates.Failed);
            swapData = {
              ...swapData,
              swapStatus: SwapStates.Failed,
            };
          }

          updateTransactionSwapData(transactionId.current, swapData);
        }
      }
    } catch (e) {
      logger.error(e);
    }
  };

  useEffect(() => {
    updateState();
    const interval = setInterval(updateState, SWAP_STATUS_UPDATE_DURATION);
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
      DEFAULT_CURRENCY,
    );

    const outputDetails: SummaryItemType = [
      {
        id: `${account.__id}-Detail-amount`,
        leftText: text,
        rightText: `${amount} ${unit}`,
        rightSubText: `${value}`,
      },
    ];

    return outputDetails;
  };

  const StatusIconMap = {
    [SwapStates.Success]: <Image src={successIcon} alt="Success Icon" />,
    [SwapStates.Pending]: (
      <SwapInformationIcon color={theme.palette.warn.main} />
    ),
    [SwapStates.Hold]: <SwapInformationIcon color={theme.palette.warn.main} />,
    [SwapStates.Expired]: (
      <SwapInformationIcon color={theme.palette.error.main} />
    ),
    [SwapStates.Failed]: (
      <SwapInformationIcon color={theme.palette.error.main} />
    ),
  };

  return (
    <Container width="full" height="full">
      <DialogBox width={600}>
        <DialogBoxBody p={0} pt={5}>
          {StatusIconMap[state]}
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={`${displayText.heading[state]}`} />
          </Typography>

          <ScrollableContainer $maxHeight={{ def: '40vh', lg: '65vh' }}>
            <DialogBoxBody p={0} px={4} pb={5} gap={24}>
              {state === SwapStates.Hold && (
                <MessageBox
                  text={parseLangTemplate(displayText.messageBox.hold, {
                    providerName: quote?.provider.name,
                    providerEmail: `[**${providerEmail}**](mailto:${providerEmail})`,
                  })}
                  type="warning"
                />
              )}
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
