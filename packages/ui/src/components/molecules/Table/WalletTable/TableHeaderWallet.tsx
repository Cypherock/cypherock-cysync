import React from 'react';
import { styled } from 'styled-components';

import { SortAsc, SortDesc, TriangleIcon } from '../../../../assets';
import { Flex, Typography } from '../../../atoms';

interface TableHeaderProps {
  lang: any;
  onSort: (
    key: 'text' | 'tokenAmount' | 'tokenValue',
    direction: 'asc' | 'desc',
  ) => void;
}

const TableHeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  background: ${({ theme }) => theme.palette.background.input};
`;

const StatusHeader = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-width: 141px;
  max-width: 200px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 215px;
    max-width: 363px;
    padding: 16px 20px;
  }
  flex-grow: 1;
`;
const AccountHeader = styled.div`
  display: flex;
  padding: 16px 16px 16px 72px;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  max-width: 400px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 400px;
    max-width: 450px;
    padding: 16px 20px 16px 96px;
  }
  flex-grow: 1;
`;

const BalanceHeader = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  min-width: 141px;
  max-width: 200px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 235px;
    max-width: 363px;
    padding: 16px 20px 16px 40px;
  }
  flex-grow: 1;
`;

const ValueHeader = styled.div`
  display: flex;
  padding: 16px 24px 16px 16px;
  justify-content: space-between;
  align-items: center;
  min-width: 141px;
  max-width: 200px;
  @media ${({ theme }) => theme.screens.lg} {
    min-width: 235px;
    max-width: 250px;
    padding: 16px 20px 16px 40px;
  }
  flex-grow: 1;
`;

export const TableHeaderWallet: React.FC<TableHeaderProps> = ({
  lang,
  onSort,
}) => (
  <TableHeaderWrapper>
    <AccountHeader>
      <Typography>
        {lang.strings.wallet.cypherock.tableHeader.account}
      </Typography>
      <Flex gap={2} direction="column">
        <SortAsc onClick={() => onSort('text', 'asc')} />
        <SortDesc onClick={() => onSort('text', 'desc')} />
      </Flex>
    </AccountHeader>
    <StatusHeader>
      <Typography>
        {lang.strings.wallet.cypherock.tableHeader.syncStatus}
      </Typography>
    </StatusHeader>
    <BalanceHeader>
      <Typography>
        {lang.strings.wallet.cypherock.tableHeader.balance}
      </Typography>
      <TriangleIcon />
    </BalanceHeader>
    <ValueHeader>
      <Typography>{lang.strings.wallet.cypherock.tableHeader.value}</Typography>
      <TriangleIcon />
    </ValueHeader>
  </TableHeaderWrapper>
);
