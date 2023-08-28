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
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  dropdownState: () => void;
  onAddTokenClick: () => void;
  onAddAccountClick: () => void;
}

const WalletHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const WalletHeader: FC<WalletHeaderProps> = ({
  title,
  breadcrumb,
  btnAddToken,
  btnAddAccount,
  dropdown,
  isOpen,
  setIsOpen,
  focusedIndex,
  setFocusedIndex,
  selectedItem,
  setSelectedItem,
  dropdownState,
  onAddTokenClick,
  onAddAccountClick,
}) => (
  <WalletHeaderWrapper>
    <Breadcrumb
      currentPage={title}
      breadcrumb={breadcrumb}
      dropdown={dropdown}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      focusedIndex={focusedIndex}
      setFocusedIndex={setFocusedIndex}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
      dropdownState={dropdownState}
    />
    <Flex gap={24}>
      <Button variant="primary" onClick={onAddTokenClick}>
        {btnAddToken}
      </Button>
      <Button variant="primary" onClick={onAddAccountClick}>
        {btnAddAccount}
      </Button>
    </Flex>
  </WalletHeaderWrapper>
);

WalletHeader.defaultProps = {
  breadcrumb: undefined,
  btnAddToken: undefined,
  btnAddAccount: undefined,
};
