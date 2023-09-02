import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { Button, Flex } from '../../atoms';
import { Breadcrumb, BreadcrumbProps } from '../Breadcrumb';

export interface WalletHeaderProps {
  title: string;
  breadcrumb?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  dropdown: BreadcrumbProps['dropdown'];
  selectedItem: string;
  setSelectedItem: BreadcrumbProps['setSelectedItem'];
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
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
  primaryActionText,
  secondaryActionText,
  dropdown,
  selectedItem,
  setSelectedItem,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const dropdownState = () => setIsOpen(!isOpen);

  return (
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
        {primaryActionText && (
          <Button variant="primary" onClick={onPrimaryAction}>
            {primaryActionText}
          </Button>
        )}
        {secondaryActionText && (
          <Button variant="primary" onClick={onSecondaryAction}>
            {secondaryActionText}
          </Button>
        )}
      </Flex>
    </WalletHeaderWrapper>
  );
};

WalletHeader.defaultProps = {
  breadcrumb: undefined,
  primaryActionText: undefined,
  secondaryActionText: undefined,
  onPrimaryAction: undefined,
  onSecondaryAction: undefined,
};
