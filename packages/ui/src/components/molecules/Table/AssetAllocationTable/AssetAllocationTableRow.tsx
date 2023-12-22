import React, { ReactNode } from 'react';

import { AssetAllocationTableVariant } from './types';

import { AllocationShare } from '../AllocationShare';
import { TableIconNameBox } from '../TableIconNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowContainer, RowWrapper } from '../TableStyles';

export interface AssetAllocationTableRowProps {
  assetIcon: ReactNode;
  assetAbbr: string;
  assetName: string;
  price: string;
  balance: string;
  balanceTooltip?: string;
  value: string;
  allocation: number;
  color: string;
  accountName?: string;
  accountTag?: string;
  walletName?: string;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  style?: any;
  variant?: AssetAllocationTableVariant;
}

export const AssetAllocationTableRow: React.FC<
  AssetAllocationTableRowProps
> = props => {
  const { $rowIndex, $isLast, onClick, style, color, variant, ...row } = props;

  return (
    <RowWrapper
      $rowIndex={$rowIndex}
      $isLast={$isLast}
      onClick={onClick}
      style={style}
      $height="80px"
    >
      <RowContainer>
        <TableIconNameBox
          icon={row.assetIcon}
          title={variant === 'accounts' ? row.accountName ?? '' : row.assetAbbr}
          subtitle={variant === 'accounts' ? undefined : row.assetName}
          tag={variant === 'accounts' ? row.accountTag : undefined}
          width={{ def: '26%', lg: '24%' }}
        />
        <TableNameBox
          text={variant === 'accounts' ? row.walletName ?? '' : row.price}
          width="18%"
        />
        <TableNameBox
          text={row.balance}
          width="18%"
          tooltip={row.balanceTooltip}
        />
        <TableNameBox text={row.value} width="18%" />
        <AllocationShare
          percentage={row.allocation}
          color={color}
          width={{ def: '20%', lg: '24%' }}
        />
      </RowContainer>
    </RowWrapper>
  );
};

AssetAllocationTableRow.defaultProps = {
  $isLast: false,
  style: undefined,
  variant: undefined,
  accountName: undefined,
  accountTag: undefined,
  walletName: undefined,
  balanceTooltip: undefined,
};
