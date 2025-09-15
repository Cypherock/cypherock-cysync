import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { SvgProps } from '../../../../assets';
import { ThemeType, useTheme } from '../../../../themes';
import { Flex } from '../../../atoms';
import { HistoryAssetBox } from '../HistoryAssetBox';
import { HistoryNameBox } from '../HistoryNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowWrapper, RowContainer } from '../TableStyles';

type SwapStatus = 'success' | 'pending' | 'failed' | 'hold' | 'expired';

export interface SwapTableRowProps {
  id: string;
  icon: React.FC<SvgProps>;
  providerName: string;
  providerImageUrl: string;
  providerUrl: string;
  sourceAssetName: string;
  sourceAssetIcon: ReactNode;
  destinationAssetName: string;
  destinationAssetIcon: ReactNode;
  receivedDisplayAmount: string;
  sentDisplayAmount: string;
  status: SwapStatus;
  time: string;
  date: string;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  style?: any;
}

export const getSwapFillFromStatus = (status: SwapStatus, theme: ThemeType) => {
  const map: Record<SwapStatus, string> = {
    success: theme.palette.text.success,
    pending: theme.palette.text.warn,
    failed: theme.palette.text.error,
    hold: theme.palette.text.warn,
    expired: theme.palette.text.error,
  };

  return map[status];
};

const DEFAULT_ROW_HEIGHT = 82;

export const SwapTableRow: React.FC<SwapTableRowProps> = props => {
  const {
    $rowIndex,
    $isLast,
    onClick,
    style,
    providerName,
    sourceAssetName,
    sourceAssetIcon,
    destinationAssetName,
    destinationAssetIcon,
    receivedDisplayAmount,
    sentDisplayAmount,
    ...row
  } = props;
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
            title={providerName}
            $icon={row.icon}
            width={{ def: '25%' }}
            p={{ def: 2 }}
            fill={getSwapFillFromStatus(row.status, theme)}
            variant="success"
            subtitle={`${row.date} ${row.time}`}
          />
          <HistoryAssetBox
            $assetName={sourceAssetName}
            $assetIcon={sourceAssetIcon}
            width={{ def: '20%' }}
          />
          <HistoryAssetBox
            $assetName={destinationAssetName}
            $assetIcon={destinationAssetIcon}
            width={{ def: '20%' }}
          />
          <TableNameBox
            text={receivedDisplayAmount}
            width={{ def: '20%' }}
            p={{ def: 2 }}
          />
          <TableNameBox
            text={sentDisplayAmount}
            width={{ def: '20%' }}
            p={{ def: 2 }}
          />
        </Flex>
      </RowContainer>
    </RowWrapper>
  );
};

SwapTableRow.defaultProps = {
  $isLast: false,
  style: undefined,
};
