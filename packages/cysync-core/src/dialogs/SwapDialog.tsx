import {
  BlurOverlay,
  Clipboard,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Flex,
  getSwapFillFromStatus,
  GoldExternalLink,
  GraphSwitchSmallIcon,
  Image,
  ScrollableContainer,
  SummaryBox,
  SummaryItemType,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import { SwapStatus } from '@cypherock/db-interfaces';
import React, { FC, useMemo } from 'react';

import { SwapTransactionRowData, useSwapTransactions } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export interface ISwapDialogProps {
  swap: SwapTransactionRowData;
}

const textColorMap: Record<SwapStatus, any> = {
  success: 'success',
  failed: 'error',
  pending: 'warn',
};

export const SwapDialog: FC<ISwapDialogProps> = ({ swap: swapSource }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { displayedData } = useSwapTransactions();
  const onClose = () => dispatch(closeDialog('swapDialog'));

  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.swapDialog;

  const swap = useMemo(
    () => displayedData.find(d => d.swapId === swapSource.swapId) ?? swapSource,
    [displayedData, swapSource.swapId],
  );

  const summaryItems: SummaryItemType = useMemo(
    () => [
      {
        id: 'provider',
        leftText: strings.provider,
        rightComponent: [
          {
            id: 'provider-info',
            name: swap.providerName,
            muted: false,
            icon: (
              <Image
                src={swap.providerImageUrl}
                alt="provider image"
                $maxHeight="20px"
              />
            ),
            rightIcon: swap.providerUrl ? (
              <a href={swap.providerUrl} target="_blank" rel="noreferrer">
                <GoldExternalLink width={15} height={12} />
              </a>
            ) : undefined,
          },
        ],
      },
      { isDivider: true, id: 'divider-1' },
      {
        id: 'swap-id',
        leftText: strings.swapId,
        rightComponent: [
          {
            id: 'swap-id-info',
            name: swap.swapId,
            muted: false,
            rightIcon: (
              <Clipboard content={swap.swapId} size="sm" variant="gold" />
            ),
          },
        ],
      },
      { isDivider: true, id: 'divider-2' },
      {
        id: 'status',
        leftText: strings.status,
        rightTextColor: textColorMap[swap.swapStatus],
        rightText: swap.displaySwapStatus,
      },
      { isDivider: true, id: 'divider-3' },
      {
        id: 'from-title',
        leftText: strings.fromTitle,
      },
      {
        id: 'from-wallet',
        leftText: strings.fromWallet,
        rightComponent: [
          {
            id: 'from-wallet-id',
            name: swap.sourceWalletName,
            muted: false,
          },
        ],
      },
      {
        id: 'from-account',
        leftText: strings.fromAccount,
        rightComponent: [
          {
            id: 'from-account-id',
            name: swap.sourceAccountName,
            muted: false,
            icon: <swap.sourceAccountIcon />,
          },
        ],
      },
      {
        id: 'from-asset',
        leftText: strings.fromAsset,
        rightComponent: [
          {
            id: 'from-asset-id',
            name: swap.sourceAssetName,
            muted: false,
            icon: <swap.sourceAssetIcon />,
          },
        ],
      },
      {
        id: 'from-amount',
        leftText: strings.fromAmount,
        rightText: swap.sentDisplayAmount,
      },
      {
        id: 'from-sender',
        leftText: strings.fromSender,
        rightComponent: [
          {
            id: 'from-sender-info',
            name: swap.sourceXpubOrAddress,
            muted: true,
            rightIcon: (
              <Clipboard
                content={swap.sourceXpubOrAddress}
                size="sm"
                variant="gold"
              />
            ),
          },
        ],
      },
      { isDivider: true, id: 'divider-4' },
      {
        id: 'to-title',
        leftText: strings.toTitle,
      },
      {
        id: 'to-wallet',
        leftText: strings.toWallet,
        rightText: swap.destinationWalletName,
      },
      {
        id: 'to-account',
        leftText: strings.toAccount,
        rightComponent: [
          {
            id: 'to-account-id',
            name: swap.destinationAccountName ?? 'Unknown',
            muted: false,
            icon: <swap.destinationAccountIcon />,
          },
        ],
      },
      {
        id: 'to-asset',
        leftText: strings.toAsset,
        rightComponent: [
          {
            id: 'to-asset-id',
            name: swap.destinationAssetName ?? 'Unknown',
            muted: false,
            icon: <swap.destinationAssetIcon />,
          },
        ],
      },
      {
        id: 'to-amount',
        leftText: strings.toAmount,
        rightText: swap.receivedDisplayAmount,
      },
      {
        id: 'to-receiver',
        leftText: strings.toReceiver,
        rightComponent: [
          {
            id: 'to-receiver-info',
            name: swap.destinationXpubOrAddress,
            muted: true,
            rightIcon: (
              <Clipboard
                content={swap.destinationXpubOrAddress}
                size="sm"
                variant="gold"
              />
            ),
          },
        ],
      },
    ],
    [swap, strings],
  );

  return (
    <BlurOverlay>
      <DialogBox width={700} onClose={onClose}>
        <DialogBoxHeader height={56} width={700}>
          <Flex width="full" justify="flex-end">
            <CloseButton onClick={onClose} />
          </Flex>
        </DialogBoxHeader>
        <DialogBoxBody
          align="center"
          direction="column"
          height="full"
          pr={0}
          pb={0}
        >
          <Container align="center" justify="center" width="full">
            <GraphSwitchSmallIcon
              width={36}
              height={36}
              fill={getSwapFillFromStatus(swap.swapStatus, theme)}
            />
          </Container>
          <Container
            display="flex"
            direction="column"
            align="center"
            width="full"
            gap={4}
          >
            <Typography variant="h5">
              {swap.sentDisplayAmount} → {swap.receivedDisplayAmount}
            </Typography>
            <Typography variant="span" color="muted">
              {swap.dateHeader} {swap.time}
            </Typography>
          </Container>
          <ScrollableContainer $maxHeight="calc(100vh - 400px)">
            <Container
              display="flex"
              direction="column"
              width="full"
              pt={5}
              pr={5}
              pb={3}
              gap={12}
            >
              <SummaryBox items={summaryItems} />
            </Container>
          </ScrollableContainer>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
