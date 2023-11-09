import React, { ReactNode } from 'react';

import { TableIconNameBox } from '../TableIconNameBox';
import { TableNameBox } from '../TableNameBox';
import { RowContainer, RowWrapper } from '../TableStyles';

export interface TokenTableRowProps {
  tokenIcon: ReactNode;
  tokenAbbr: string;
  tokenName: string;
  balance: string;
  balanceTooltip?: string;
  value: string;
  $rowIndex: number;
  $isLast?: boolean;
  onClick: () => void;
  style?: any;
}

export const TokenTableRow: React.FC<TokenTableRowProps> = props => {
  const { $rowIndex, $isLast, onClick, style, ...row } = props;

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
          icon={row.tokenIcon}
          title={row.tokenName}
          subtitle={row.tokenAbbr}
          width={{ def: '38%', lg: '38%' }}
        />
        <TableNameBox
          text={row.balance}
          width="32%"
          tooltip={row.balanceTooltip}
        />
        <TableNameBox text={row.value} width="32%" />
      </RowContainer>
    </RowWrapper>
  );
};

TokenTableRow.defaultProps = {
  $isLast: false,
  style: undefined,
  balanceTooltip: undefined,
};
