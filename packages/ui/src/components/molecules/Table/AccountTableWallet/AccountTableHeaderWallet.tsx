import React from 'react';
import { styled } from 'styled-components';

import { SortAsc, SortDesc, TriangleIcon } from '../../../../assets';
import { Flex, Typography } from '../../../atoms';

interface TableHeaderProps {
  account: string;
  syncStatus: string;
  balance: string;
  value: string;
  onSort: (
    key: 'text' | 'tokenAmount' | 'tokenValue',
    direction: 'asc' | 'desc',
  ) => void;
}

const TableHeaderWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.palette.background.input};
`;

const FixedWidthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300px;
  padding: 16px 16px 16px 72px;
  @media ${({ theme }) => theme.screens.lg} {
    width: 400px;
  }
`;

const StatusHeader = styled(FixedWidthHeader)`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  flex: 1;
  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px;
  }
`;

const BalanceHeader = styled(FixedWidthHeader)`
  padding: 16px;
  box-sizing: border-box;

  flex: 1;
  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px;
  }
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 147px;
  padding: 16px 24px 16px 16px;
  @media ${({ theme }) => theme.screens.lg} {
    width: 250px;
    padding: 16px 20px 16px 40px;
  }
`;

export const AccountTableHeaderWallet: React.FC<TableHeaderProps> = ({
  account,
  syncStatus,
  balance,
  value,
  onSort,
}) => (
  <TableHeaderWrapper>
    <FixedWidthHeader>
      <Typography color="muted">{account}</Typography>
      <Flex gap={2} direction="column">
        <SortAsc onClick={() => onSort('text', 'asc')} />
        <SortDesc onClick={() => onSort('text', 'desc')} />
      </Flex>
    </FixedWidthHeader>
    <StatusHeader>
      <Typography color="muted">{syncStatus}</Typography>
    </StatusHeader>
    <BalanceHeader>
      <Typography color="muted">{balance}</Typography>
      <TriangleIcon />
    </BalanceHeader>
    <ValueHeader>
      <Typography color="muted">{value}</Typography>
      <TriangleIcon />
    </ValueHeader>
  </TableHeaderWrapper>
);
