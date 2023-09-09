import React, { ReactNode } from 'react';

import { AllocationShare } from '../AllocationShare';
import { TableIconNameBox } from '../TableIconNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowWrapper } from '../TableStyles';

export interface AssetAllocationTableRowProps {
  assetIcon: ReactNode;
  assetAbbr: string;
  assetName: string;
  price: string;
  balance: string;
  value: string;
  allocation: number;
  color: string;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  style?: any;
}

export const AssetAllocationTableRow: React.FC<
  AssetAllocationTableRowProps
> = props => {
  const { $rowIndex, $isLast, onClick, style, color, ...row } = props;

  return (
    <RowWrapper
      $rowIndex={$rowIndex}
      $isLast={$isLast}
      onClick={onClick}
      style={style}
      $height="80px"
    >
      <TableIconNameBox
        icon={row.assetIcon}
        title={row.assetAbbr}
        subtitle={row.assetName}
        width={{ def: '26%', lg: '24%' }}
      />
      <TableNameBox text={row.price} width="18%" />
      <TableNameBox text={row.balance} width="18%" />
      <TableNameBox text={row.value} width="18%" />
      <AllocationShare
        percentage={row.allocation}
        color={color}
        width={{ def: '20%', lg: '24%' }}
      />
    </RowWrapper>
  );
};

AssetAllocationTableRow.defaultProps = {
  $isLast: false,
  style: undefined,
};
