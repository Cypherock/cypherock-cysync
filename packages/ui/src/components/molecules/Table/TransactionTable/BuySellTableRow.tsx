import { IBuySellOrder, IBuySellStatus } from '@cypherock/db-interfaces';
import { format as formatDate } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';

import { BuySellHistoryAssetBox } from './BuySellHistoryAssetBox';

import { DollarIcon, SvgProps } from '../../../../assets';
import { ThemeType, useTheme } from '../../../../themes';
import { Flex } from '../../../atoms';
import { HistoryNameBox } from '../HistoryNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowWrapper, RowContainer } from '../TableStyles';

const DEFAULT_ROW_HEIGHT = 82;

export interface BuySellOrderRowData extends IBuySellOrder {
  providerName: string;
  providerImageUrl: string;
  providerUrl?: string;
  destinationWalletName: string;
  destinationAccountName: string;
  destinationAccountIcon: React.FC<SvgProps>;
  destinationAssetName: string;
  destinationAssetIcon: React.FC<SvgProps>;
  sentDisplayAmount: string;
  receivedDisplayAmount: string;
  isGroupHeader?: boolean;
}

export interface BuySellTableRowProps {
  order: BuySellOrderRowData;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  style?: any;
}

export const getOrderFillFromStatus = (
  status: IBuySellStatus,
  theme: ThemeType,
) => {
  const map = {
    complete: theme.palette.text.success,
    created: theme.palette.text.warn,
    pending: theme.palette.text.warn,
    failed: theme.palette.text.error,
    expired: theme.palette.text.error,
    hold: theme.palette.text.warn,
    refunded: theme.palette.text.muted,
  };
  return map[status];
};

export const BuySellTableRow = (props: BuySellTableRowProps) => {
  const { $rowIndex, onClick, order, $isLast, style } = props;

  const theme = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(DEFAULT_ROW_HEIGHT);

  const onResize = () => {
    setContainerHeight(
      containerRef.current?.clientHeight ?? DEFAULT_ROW_HEIGHT,
    );
  };

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const dateObj = new Date(order.createdAt);
  const time = formatDate(dateObj, 'h:mm a');
  const date = formatDate(dateObj, 'd/M/yy');

  return (
    <RowWrapper
      $rowIndex={$rowIndex}
      $isLast={$isLast}
      onClick={onClick}
      $height={`${containerHeight}px`}
      style={style}
    >
      <RowContainer ref={containerRef} direction="row">
        <Flex align="center" direction="row" width="inherit">
          <HistoryNameBox
            title={order.providerName}
            $icon={DollarIcon}
            width={{ def: '25%' }}
            p={{ def: 2 }}
            variant="success"
            subtitle={`${date} | ${time}`}
            fill={getOrderFillFromStatus(order.status, theme)}
          />
          <BuySellHistoryAssetBox
            width={{ def: '35%' }}
            wallet={order.destinationWalletName}
            $assetIcon={order.destinationAssetIcon}
            $assetName={order.destinationAssetName}
            $accountIcon={order.destinationAccountIcon}
            $accountName={order.destinationAccountName}
            assetId={order.assetId}
            parentAssetId={order.parentAssetId}
          />
          <TableNameBox
            text={order.receivedDisplayAmount}
            width={{ def: '20%' }}
            p={{ def: 2 }}
          />
          <TableNameBox
            text={order.sentDisplayAmount}
            width={{ def: '20%' }}
            p={{ def: 2 }}
          />
        </Flex>
      </RowContainer>
    </RowWrapper>
  );
};

BuySellTableRow.defaultProps = {
  $isLast: false,
  style: undefined,
};
