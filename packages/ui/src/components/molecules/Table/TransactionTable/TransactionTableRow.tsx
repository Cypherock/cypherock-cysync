import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { TransactionTableVariant } from './types';

import { ArrowUp, ArrowDown, SvgProps } from '../../../../assets';
import { ThemeType, useTheme } from '../../../../themes';
import { Button, Container, Flex } from '../../../atoms';
import { AccordionContent } from '../AccordionContent';
import { HistoryAssetBox } from '../HistoryAssetBox';
import { HistoryNameBox } from '../HistoryNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowWrapper, RowContainer } from '../TableStyles';

export type TransactionTableStatus = 'pending' | 'failed' | 'success';

export interface TransactionTableRowProps {
  id: string;
  type: string;
  status: TransactionTableStatus;
  assetIcon: ReactNode;
  accountIcon: ReactNode;
  icon: React.FC<SvgProps>;
  time: string;
  date?: string;
  asset: string;
  wallet: string;
  account: string;
  accountTag: string;
  amount: string;
  amountTooltip?: string;
  accountHeader: string;
  valueHeader: string;
  value: string;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  isSmallScreen: boolean;
  style?: any;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  variant?: TransactionTableVariant;
}

export const getTransactionFillFromStatus = (
  status: TransactionTableStatus,
  theme: ThemeType,
) => {
  const map: Record<TransactionTableStatus, string> = {
    success: theme.palette.text.success,
    pending: theme.palette.text.warn,
    failed: theme.palette.text.error,
  };

  return map[status];
};

const DEFAULT_ROW_HEIGHT = 82;

export const TransactionTableRow: React.FC<
  TransactionTableRowProps
> = props => {
  const {
    $rowIndex,
    $isLast,
    onClick,
    isSmallScreen,
    accountHeader,
    valueHeader,
    style,
    isExpanded,
    setIsExpanded,
    variant,
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
  }, [isExpanded]);

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
      <RowContainer
        ref={containerRef}
        direction={isExpanded ? 'column' : 'row'}
      >
        <Flex align="center" direction="row" width="inherit">
          <HistoryNameBox
            $icon={row.icon}
            fill={getTransactionFillFromStatus(row.status, theme)}
            variant="grey"
            pl={isSmallScreen ? 3 : undefined}
            title={row.type}
            subtitle={row.time}
            date={row.date}
            width={
              variant === 'withTimeAndValues'
                ? { def: '42%' }
                : { def: '42%', lg: '24%' }
            }
          />
          {variant === 'withNoAssetColumn' && (
            <TableNameBox
              text={row.wallet}
              width={{ def: '28%', lg: '16%' }}
              p={{ def: 2 }}
            />
          )}
          {!['withNoAssetColumn', 'withTimeAndValues'].includes(
            variant as any,
          ) && (
            <HistoryAssetBox
              $assetName={row.asset}
              $assetIcon={row.assetIcon}
              width={{ def: '28%', lg: '16%' }}
              p={isSmallScreen ? 2 : undefined}
            />
          )}
          {!isSmallScreen && variant !== 'withTimeAndValues' && (
            <HistoryAssetBox
              wallet={variant === 'withNoAssetColumn' ? undefined : row.wallet}
              $assetIcon={row.accountIcon}
              $assetName={row.account}
              $tag={row.accountTag}
              width={{ def: '30%' }}
            />
          )}
          <TableNameBox
            text={row.amount}
            width={
              variant === 'withTimeAndValues'
                ? { def: '30%', lg: '30%' }
                : { def: '22%', lg: '15%' }
            }
            p={{ def: 2 }}
            tooltip={row.amountTooltip}
          />
          {(!isSmallScreen || variant === 'withTimeAndValues') && (
            <TableNameBox
              text={row.value}
              width={{ def: variant === 'withTimeAndValues' ? '28%' : '15%' }}
              p={{ def: 2 }}
            />
          )}
          {isSmallScreen && variant !== 'withTimeAndValues' && (
            <Container $alignSelf="stretch" $flex={1} $noFlex>
              <Button
                display="flex"
                width="100%"
                height="100%"
                justify="flex-end"
                align="center"
                variant="none"
                pr={3}
                onClick={event => {
                  event.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? <ArrowUp /> : <ArrowDown />}
              </Button>
            </Container>
          )}
        </Flex>
        {isSmallScreen && isExpanded && (
          <AccordionContent
            id={row.id}
            headers={[accountHeader, valueHeader]}
            items={[
              {
                component: (
                  <HistoryAssetBox
                    wallet={
                      variant === 'withNoAssetColumn' ? undefined : row.wallet
                    }
                    size="big"
                    pl="88"
                    $assetIcon={row.accountIcon}
                    $assetName={row.account}
                    $tag={row.accountTag}
                    key={`${row.id}-account`}
                  />
                ),
                width: 425,
                padding: 16,
                paddingLeft: '88',
              },
              {
                component: (
                  <TableNameBox
                    text={row.value}
                    key={`${row.id}-value`}
                    $flex={1}
                  />
                ),
              },
            ]}
            $last={$isLast ?? false}
          />
        )}
      </RowContainer>
    </RowWrapper>
  );
};

TransactionTableRow.defaultProps = {
  date: undefined,
  $isLast: false,
  style: undefined,
  variant: 'default',
  amountTooltip: undefined,
};
