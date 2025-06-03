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
  SvgProps,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import { SwapStatus } from '@cypherock/db-interfaces';
import React, { FC } from 'react';
import { closeDialog, useAppDispatch } from '~/store';

export interface ISwapDialogProps {
  swap: {
    swapId: string;
    icon: React.FC<SvgProps>;
    providerName: string;
    providerImageUrl: string;
    providerUrl: string;
    time: string;
    timestamp: number;
    dateTime: string;
    date: string;
    dateHeader: string;
    sourceWalletName: string;
    sourceAccountName: string;
    sourceAccountIcon: React.FC<SvgProps>;
    sourceAssetName: string;
    sourceAssetIcon: React.FC<SvgProps>;
    sourceXpubOrAddress: string;
    destinationWalletName: string;
    destinationAccountName: string;
    destinationAccountIcon: React.FC<SvgProps>;
    destinationAssetName: string;
    destinationAssetIcon: React.FC<SvgProps>;
    destinationXpubOrAddress: string;
    receivedDisplayAmount: string;
    sentDisplayAmount: string;
    swapStatus: SwapStatus;
    sentTransactionHash: string;
    receiveTransactionHash?: string;
  };
}

export const SwapDialog: FC<ISwapDialogProps> = ({ swap }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const onClose = () => dispatch(closeDialog('swapDialog'));

  const summaryItems: SummaryItemType = [
    {
      id: 'provider',
      leftText: 'Provider',
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
      leftText: 'Swap Id',
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
      leftText: 'Status',
      rightText: swap.swapStatus,
    },
    { isDivider: true, id: 'divider-3' },
    {
      id: 'from-title',
      leftText: 'From',
    },
    {
      id: 'from-wallet',
      leftText: 'Wallet',
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
      leftText: 'Account',
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
      leftText: 'Asset',
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
      leftText: 'Amount Sent',
      rightText: swap.sentDisplayAmount,
    },
    {
      id: 'from-sender',
      leftText: 'Sender',
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
      leftText: 'To',
    },
    {
      id: 'to-wallet',
      leftText: 'Wallet',
      rightText: swap.destinationWalletName,
    },
    {
      id: 'to-account',
      leftText: 'Account',
      rightComponent: [
        {
          id: 'to-account-id',
          name: swap.destinationAccountName,
          muted: false,
          icon: <swap.destinationAccountIcon />,
        },
      ],
    },
    {
      id: 'to-asset',
      leftText: 'Asset',
      rightComponent: [
        {
          id: 'to-asset-id',
          name: swap.destinationAssetName,
          muted: false,
          icon: <swap.destinationAssetIcon />,
        },
      ],
    },
    {
      id: 'to-amount',
      leftText: 'Amount Received',
      rightText: swap.receivedDisplayAmount,
    },
    {
      id: 'to-receiver',
      leftText: 'Receiver',
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
  ];

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
