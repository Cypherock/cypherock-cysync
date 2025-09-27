import {
  BlurOverlay,
  BuySellOrderRowData,
  Clipboard,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  DollarIcon,
  Flex,
  getOrderFillFromStatus,
  GoldExternalLink,
  Image,
  ScrollableContainer,
  SummaryBox,
  SummaryItemType,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import { IBuySellStatus } from '@cypherock/db-interfaces';
import { format } from 'date-fns';
import React, { FC, useMemo } from 'react';

import { countryList } from '~/countries';
import { useBuySellOrders } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';

export interface IBuySellDialogProps {
  buySell: BuySellOrderRowData;
}

const textColorMap: Record<IBuySellStatus, any> = {
  completed: 'success',
  pending: 'warn',
  created: 'warn',
  expired: 'error',
  failed: 'error',
  hold: 'warn',
  refunded: 'muted',
};

const statusTextMap: Record<IBuySellStatus, string> = {
  completed: 'Success',
  pending: 'Pending',
  created: 'Created',
  expired: 'Expired',
  failed: 'Failed',
  hold: 'On Hold',
  refunded: 'Refunded',
};

export const BuySellDialog: FC<IBuySellDialogProps> = ({
  buySell: buySellSource,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { displayedData } = useBuySellOrders();
  const onClose = () => dispatch(closeDialog('buySellDialog'));

  const strings = {
    provider: 'Provider',
    orderId: 'Order ID',
    status: 'Status',
    region: 'Region',
    fromTitle: 'From',
    toTitle: 'To',
    fromAsset: 'Asset',
    fromAmount: 'Amount Sent',
    toWallet: 'Wallet',
    toAsset: 'Asset',
    toAccount: 'Account',
    toAmount: 'Amount Received',
    paymentMethod: 'Payment Method',
  };

  const order = useMemo(
    () => displayedData.find(d => d.id === buySellSource.id) ?? buySellSource,
    [displayedData, buySellSource.id],
  );

  const country = countryList[order.country];

  const summaryItems: SummaryItemType = useMemo(
    () => [
      {
        id: 'provider',
        leftText: strings.provider,
        rightComponent: [
          {
            id: 'provider-info',
            name: order.providerName,
            muted: false,
            icon: (
              <Image
                src={order.providerImageUrl}
                alt="provider image"
                $maxHeight="20px"
              />
            ),
            rightIcon: order.providerUrl ? (
              <a href={order.providerUrl} target="_blank" rel="noreferrer">
                <GoldExternalLink width={15} height={12} />
              </a>
            ) : undefined,
          },
        ],
      },
      { isDivider: true, id: 'divider-1' },
      {
        id: 'order-id',
        leftText: strings.orderId,
        rightComponent: [
          {
            id: 'order-id-info',
            name: order.id,
            muted: false,
            rightIcon: (
              <Clipboard content={order.id} size="sm" variant="gold" />
            ),
          },
        ],
      },
      { isDivider: true, id: 'divider-2' },
      {
        id: 'status',
        leftText: strings.status,
        rightTextColor: textColorMap[order.status],
        rightText: statusTextMap[order.status],
      },
      { isDivider: true, id: 'divider-3' },
      {
        id: 'region',
        leftText: strings.region,
        rightComponent: [
          {
            id: 'region-info',
            name: country.name,
            muted: false,
            rightIcon: <Typography>{country.flag}</Typography>,
          },
        ],
      },
      { isDivider: true, id: 'divider-4' },
      {
        id: 'from-title',
        leftText: strings.fromTitle,
      },
      {
        id: 'from-asset',
        leftText: strings.fromAsset,
        rightComponent: [
          {
            id: 'from-asset-id',
            name: order.currencyFrom,
            muted: false,
          },
        ],
      },
      {
        id: 'from-amount',
        leftText: strings.fromAmount,
        rightText: order.sentDisplayAmount,
      },
      {
        id: 'payment-method',
        leftText: strings.paymentMethod,
        rightText: order.paymentMethod.name,
      },
      { isDivider: true, id: 'divider-5' },
      {
        id: 'to-title',
        leftText: strings.toTitle,
      },
      {
        id: 'to-wallet',
        leftText: strings.toWallet,
        rightText: order.destinationWalletName,
      },
      {
        id: 'to-account',
        leftText: strings.toAccount,
        rightComponent: [
          {
            id: 'to-account-id',
            name: order.destinationAccountName,
            muted: false,
            icon: <order.destinationAccountIcon />,
          },
        ],
      },
      {
        id: 'to-asset',
        leftText: strings.toAsset,
        rightComponent: [
          {
            id: 'to-asset-id',
            name: order.destinationAssetName,
            muted: false,
            icon: <order.destinationAssetIcon />,
          },
        ],
      },
      {
        id: 'to-amount',
        leftText: strings.toAmount,
        rightText: order.receivedDisplayAmount,
      },
      { isDivider: true, id: 'divider-6' },
    ],
    [order, strings],
  );

  const dateObj = new Date(order.createdAt);
  const time = format(dateObj, 'h:mm a');
  const dateHeader = format(dateObj, 'eeee, MMMM d yyyy');

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
            <DollarIcon
              width={36}
              height={36}
              fill={getOrderFillFromStatus(order.status, theme)}
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
              {order.sentDisplayAmount} → {order.receivedDisplayAmount}
            </Typography>
            <Typography variant="span" color="muted">
              {dateHeader} {time}
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
