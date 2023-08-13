import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { DropdownItem, ListItemDropdown } from '..';
import { DropdownArrow } from '../../assets';
import { Flex, Typography } from '../atoms';

interface BreadcrumbProps {
  currentPage: string;
  breadcrumb?: string;
  dropdown?: DropdownItem[];
}

const CustomTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.background.breadcrumbSeparator};
`;

const DropDownWrapper = styled.div`
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ListItemWrapper = styled.div`
  display: inline-flex;
  position: absolute;
  z-index: 1000;
  padding: 24px 0px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  width: 276px;
  height: 240px;
  left: calc(20vw);
  top: calc(15vh);
`;

export const Breadcrumb: FC<BreadcrumbProps> = ({
  currentPage,
  breadcrumb,
  dropdown,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownState = () => setIsOpen(!isOpen);
  const [selectedItem, setSelectedItem] = useState('');

  const handleRadioCheckChange = (itemText: string) => {
    setSelectedItem(itemText);
    setIsOpen(!isOpen);
  };

  return (
    <Flex direction="column" gap={20}>
      <Flex gap={12} align="center">
        <Typography $fontSize={16} $fontWeight="medium" color="muted">
          {currentPage}
        </Typography>
        {breadcrumb ? (
          <DropDownWrapper onClick={dropdownState}>
            <CustomTypography $fontSize={16} $fontWeight="medium">
              /
            </CustomTypography>
            <Flex gap={16} align="center">
              <Typography $fontSize={16} $fontWeight="medium">
                {breadcrumb}
              </Typography>
              <DropdownArrow />
            </Flex>
          </DropDownWrapper>
        ) : undefined}
      </Flex>
      {isOpen && dropdown?.length && (
        <ListItemWrapper>
          {dropdown.map(item => (
            <ListItemDropdown
              key={item.id}
              text={item.text}
              checkType={item.checkType}
              checked={selectedItem === item.text}
              onChange={() => handleRadioCheckChange(item.text)}
            />
          ))}
        </ListItemWrapper>
      )}
    </Flex>
  );
};

Breadcrumb.defaultProps = {
  breadcrumb: undefined,
  dropdown: [],
};
