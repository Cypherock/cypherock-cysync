import React, { FC } from 'react';
import styled from 'styled-components';

import { Button, Flex } from '../../atoms';
import { Breadcrumb } from '../Breadcrumb';

export interface DropdownItem {
  id: string;
  text: string;
  checkType?: string;
}

interface WalletHeaderProps {
  title: string;
  breadcrumb?: string;
  btnAddToken?: string;
  btnAddAccount?: string;
  dropdown: DropdownItem[];
}

const WalletHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 1280px;
  max-width: 1416px;
  padding: 10px 40px;
  margin-top: 16px;
`;

export const WalletHeader: FC<WalletHeaderProps> = ({
  title,
  breadcrumb,
  btnAddToken,
  btnAddAccount,
  dropdown,
}) => (
  <WalletHeaderWrapper>
    <Breadcrumb
      currentPage={title}
      breadcrumb={breadcrumb}
      dropdown={dropdown}
    />
    <Flex gap={24}>
      <Button variant="primary">{btnAddToken}</Button>
      <Button variant="primary">{btnAddAccount}</Button>
    </Flex>
  </WalletHeaderWrapper>
);

WalletHeader.defaultProps = {
  breadcrumb: undefined,
  btnAddToken: undefined,
  btnAddAccount: undefined,
};
