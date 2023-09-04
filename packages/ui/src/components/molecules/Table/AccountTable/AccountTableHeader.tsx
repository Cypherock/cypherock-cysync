import React from 'react';
import { styled } from 'styled-components';

import { TriangleIcon } from '../../../../assets';
import { Container, Typography } from '../../../atoms';

export type AccountTableHeaderName = 'account' | 'amount' | 'value';

export interface AccountTableHeaderProps {
  account: string;
  syncStatus: string;
  balance: string;
  value: string;
  onSort: (key: AccountTableHeaderName) => void;
  selected: AccountTableHeaderName;
  $ascending: boolean;
}

const TableHeaderWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.palette.background.input};
`;

const FixedWidthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 80px;
  cursor: pointer;

  width: 42%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 29%;
    padding: 16px 16px 16px 96px;
  }
`;

const StatusHeader = styled(FixedWidthHeader)`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: unset;

  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 20px;
  }
`;

const BalanceHeader = styled(FixedWidthHeader)`
  padding: 16px;
  box-sizing: border-box;

  width: 19%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 26%;
    padding: 16px 20px;
    padding-left: 0;
  }
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 16px 16px;
  cursor: pointer;

  width: 20%;
  @media ${({ theme }) => theme.screens.mdlg} {
    width: 19%;
    padding: 16px 20px 16px 40px;
  }
`;

export const AccountTableHeader: React.FC<AccountTableHeaderProps> = ({
  account,
  syncStatus,
  balance,
  value,
  onSort,
  $ascending,
  selected,
}) => {
  const getSortIcon = (key: AccountTableHeaderName) => (
    <Container display="flex" direction="column" gap={2}>
      {selected === key ? (
        <TriangleIcon rotate={$ascending ? 0 : 180} />
      ) : (
        <>
          <TriangleIcon />
          <TriangleIcon rotate={180} />
        </>
      )}
    </Container>
  );

  return (
    <TableHeaderWrapper>
      <FixedWidthHeader onClick={() => onSort('account')}>
        <Typography color="muted">{account}</Typography>
        {getSortIcon('account')}
      </FixedWidthHeader>
      <StatusHeader>
        <Typography color="muted">{syncStatus}</Typography>
      </StatusHeader>
      <BalanceHeader onClick={() => onSort('amount')}>
        <Typography color="muted">{balance}</Typography>
        {getSortIcon('amount')}
      </BalanceHeader>
      <ValueHeader onClick={() => onSort('value')}>
        <Typography color="muted">{value}</Typography>
        {getSortIcon('value')}
      </ValueHeader>
    </TableHeaderWrapper>
  );
};
